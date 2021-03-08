import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store'
import axios from 'src/utils/axios';
import objFromArray from 'src/utils/objFromArray';
import type {
  Board,
  Card,
  CheckItem,
  Checklist,
  Comment,
  List,
  Member
} from 'src/types/kanban';

interface KanbanState {
  isLoaded: boolean;
  lists: {
    byId: Record<string, List>;
    allIds: string[];
  };
  cards: {
    byId: Record<string, Card>;
    allIds: string[];
  };
  members: {
    byId: Record<string, Member>;
    allIds: string[];
  };
};

const initialState: KanbanState = {
  isLoaded: false,
  lists: {
    byId: {},
    allIds: []
  },
  cards: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    getBoard(state: KanbanState, action: PayloadAction<{ board: Board; }>) {
      const { board } = action.payload;

      state.lists.byId = objFromArray(board.lists);
      state.lists.allIds = Object.keys(state.lists.byId);
      state.cards.byId = objFromArray(board.cards);
      state.cards.allIds = Object.keys(state.cards.byId);
      state.members.byId = objFromArray(board.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.isLoaded = true;
    },
    createList(state: KanbanState, action: PayloadAction<{ list: List; }>) {
      const { list } = action.payload;

      state.lists.byId[list.id] = list;
      state.lists.allIds.push(list.id);
    },
    updateList(state: KanbanState, action: PayloadAction<{ list: List; }>) {
      const { list } = action.payload;

      state.lists.byId[list.id] = list;
    },
    clearList(state: KanbanState, action: PayloadAction<{ listId: string; }>) {
      const { listId } = action.payload;
      const { cardIds } = state.lists.byId[listId];

      state.lists.byId[listId].cardIds = [];
      state.cards.byId = _.omit(state.cards.byId, cardIds);
      _.pull(state.cards.allIds, ...cardIds);
    },
    deleteList(state: KanbanState, action: PayloadAction<{ listId: string; }>) {
      const { listId } = action.payload;

      state.lists.byId = _.omit(state.lists.byId, listId);
      _.pull(state.lists.allIds, listId);
    },
    createCard(state: KanbanState, action: PayloadAction<{ card: Card; }>) {
      const { card } = action.payload;

      state.cards.byId[card.id] = card;
      state.cards.allIds.push(card.id);
      state.lists.byId[card.listId].cardIds.push(card.id);
    },
    updateCard(state: KanbanState, action: PayloadAction<{ card: Card; }>) {
      const { card } = action.payload;

      _.merge(state.cards.byId[card.id], card);
    },
    moveCard(state: KanbanState, action: PayloadAction<{ cardId: string; position: number; listId?: string; }>) {
      const { cardId, position, listId } = action.payload;
      const { listId: sourceListId } = state.cards.byId[cardId];

      // Remove card from source list
      _.pull(state.lists.byId[sourceListId].cardIds, cardId);

      // If listId arg exists, it means that
      // we have to add the card to the new list
      if (listId) {
        state.cards.byId[cardId].listId = listId;
        state.lists.byId[listId].cardIds.splice(position, 0, cardId);
      } else {
        state.lists.byId[sourceListId].cardIds.splice(position, 0, cardId);
      }
    },
    deleteCard(state: KanbanState, action: PayloadAction<{ cardId: string; }>) {
      const { cardId } = action.payload;
      const { listId } = state.cards.byId[cardId];

      state.cards.byId = _.omit(state.cards.byId, cardId);
      _.pull(state.cards.allIds, cardId);
      _.pull(state.lists.byId[listId].cardIds, cardId);
    },
    addComment(state: KanbanState, action: PayloadAction<{ comment: Comment; }>) {
      const { comment } = action.payload;
      const card = state.cards.byId[comment.cardId];

      card.comments.push(comment);
    },
    addChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklist: Checklist; }>) {
      const { cardId, checklist } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists.push(checklist);
    },
    updateChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklist: Checklist; }>) {
      const { cardId, checklist } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = _.map(card.checklists, (_checklist) => {
        if (_checklist.id === checklist.id) {
          return checklist;
        }

        return _checklist;
      });
    },
    deleteChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; }>) {
      const { cardId, checklistId } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = _.reject(card.checklists, { id: checklistId });
    },
    addCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem; }>) {
      const { cardId, checklistId, checkItem } = action.payload;
      const card = state.cards.byId[cardId];

      _.assign(card, {
        checklists: _.map(card.checklists, (checklist) => {
          if (checklist.id === checklistId) {
            _.assign(checklist, {
              checkItems: [...checklist.checkItems, checkItem]
            });
          }

          return checklist;
        })
      });
    },
    updateCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem; }>) {
      const {
        cardId,
        checklistId,
        checkItem
      } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = _.map(card.checklists, (checklist) => {
        if (checklist.id === checklistId) {
          _.assign(checklist, {
            checkItems: _.map(checklist.checkItems, (_checkItem) => {
              if (_checkItem.id === checkItem.id) {
                return checkItem;
              }

              return _checkItem;
            })
          });
        }

        return checklist;
      });
    },
    deleteCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItemId: string; }>) {
      const { cardId, checklistId, checkItemId } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = _.map(card.checklists, (checklist) => {
        if (checklist.id === checklistId) {
          _.assign(checklist, {
            checkItems: _.reject(checklist.checkItems, { id: checkItemId })
          });
        }

        return checklist;
      });
    }
  }
});

export const reducer = slice.reducer;

export const getBoard = (): AppThunk => async (dispatch) => {
  const response = await axios.get<{ board: Board; }>('/api/kanban/board');

  dispatch(slice.actions.getBoard(response.data));
};

export const createList = (name: string): AppThunk => async (dispatch) => {
  const response = await axios.post<{ list: List; }>('/api/kanban/lists/new', {
    name
  });

  dispatch(slice.actions.createList(response.data));
};

export const updateList = (listId: string, update: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ list: List; }>('/api/kanban/list/update', {
    listId,
    update
  });

  dispatch(slice.actions.updateList(response.data));
};

export const clearList = (listId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/lists/clear', {
    listId
  });

  dispatch(slice.actions.clearList({ listId }));
};

export const deleteList = (listId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/lists/remove', {
    listId
  });

  dispatch(slice.actions.deleteList({ listId }));
};

export const createCard = (listId: string, name: string): AppThunk => async (dispatch) => {
  const response = await axios.post<{ card: Card; }>('/api/kanban/cards/new', {
    listId,
    name
  });

  dispatch(slice.actions.createCard(response.data));
};

export const updateCard = (cardId: string, update: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ card: Card; }>('/api/kanban/cards/update', {
    cardId,
    update
  });

  dispatch(slice.actions.updateCard(response.data));
};

export const moveCard = (cardId: string, position: number, listId?: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/cards/move', {
    cardId,
    position,
    listId
  });

  dispatch(slice.actions.moveCard({
    cardId,
    position,
    listId
  }));
};

export const deleteCard = (cardId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/cards/remove', {
    cardId
  });

  dispatch(slice.actions.deleteCard({ cardId }));
};

export const addComment = (cardId: string, message: string): AppThunk => async (dispatch) => {
  const response = await axios.post<{ comment: Comment; }>('/api/kanban/comments/new', {
    cardId,
    message
  });

  dispatch(slice.actions.addComment(response.data));
};

export const addChecklist = (cardId: string, name: string): AppThunk => async (dispatch) => {
  const response = await axios.post<{ checklist: Checklist; }>('/api/kanban/checklists/new', {
    cardId,
    name
  });
  const { checklist } = response.data;

  dispatch(slice.actions.addChecklist({
    cardId,
    checklist
  }));
};

export const updateChecklist = (cardId: string, checklistId: string, update: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ checklist: Checklist; }>('/api/kanban/checklists/update', {
    cardId,
    checklistId,
    update
  });
  const { checklist } = response.data;

  dispatch(slice.actions.updateChecklist({
    cardId,
    checklist
  }));
};

export const deleteChecklist = (cardId: string, checklistId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/checklists/remove', {
    cardId,
    checklistId
  });

  dispatch(slice.actions.deleteChecklist({
    cardId,
    checklistId
  }));
};

export const addCheckItem = (cardId: string, checklistId: string, name: string): AppThunk => async (dispatch) => {
  const response = await axios.post<{ checkItem: CheckItem; }>('/api/kanban/checkitems/new', {
    cardId,
    checklistId,
    name
  });
  const { checkItem } = response.data;

  dispatch(slice.actions.addCheckItem({
    cardId,
    checklistId,
    checkItem
  }));
};

export const updateCheckItem = (cardId: string, checklistId: string, checkItemId: string, update: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ checkItem: CheckItem; }>('/api/kanban/checkitems/update', {
    cardId,
    checklistId,
    checkItemId,
    update
  });
  const { checkItem } = response.data;

  dispatch(slice.actions.updateCheckItem({
    cardId,
    checklistId,
    checkItem
  }));
};

export const deleteCheckItem = (cardId: string, checklistId: string, checkItemId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/kanban/checkitems/remove', {
    cardId,
    checklistId,
    checkItemId
  });

  dispatch(slice.actions.deleteCheckItem({
    cardId,
    checklistId,
    checkItemId
  }));
};

export default slice;
