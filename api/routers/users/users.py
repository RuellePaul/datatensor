from fastapi import APIRouter, Depends

from dependencies import logged_admin, logged_user
from routers.users.core import find_users, find_user, remove_users, remove_user, update_user, update_user_password
from routers.users.models import *

users = APIRouter()


@users.get('/', response_model=UsersResponse, dependencies=[Depends(logged_admin)])
def get_users(offset: int = 0, limit: int = 0):
    """
    Fetch paginated datatensor users list.
    🔒️ Admin only
    """
    result = find_users(offset, limit)
    return {'users': [User.from_mongo(user) for user in result]}


@users.get('/{user_id}', response_model=UserResponse)
def get_user(user_id):
    """
    Fetch user, given `user_id`
    """
    result = find_user(user_id)
    return {'user': User.from_mongo(result)}


@users.patch('/me')
def patch_user(update: UserUpdateProfileBody, user: User = Depends(logged_user)):
    """
    Update logged user profile
    """
    update_user(user, update)


@users.patch('/me/password')
def patch_user_password(payload: UserUpdatePasswordBody, user: User = Depends(logged_user)):
    """
    Update logged user password
    """
    update_user_password(user, payload.password, payload.new_password)


@users.delete('/', dependencies=[Depends(logged_admin)])
def delete_users(payload: UserDeleteBody):
    """
    Delete selected users, if they aren't admin.
    🔒️ Admin only
    """
    remove_users(payload.user_ids)


@users.delete('/{user_id}', dependencies=[Depends(logged_admin)])
def delete_user(user_id):
    """
    Delete given user, if he is not an admin.
    🔒️ Admin only
    """
    remove_user(user_id)
