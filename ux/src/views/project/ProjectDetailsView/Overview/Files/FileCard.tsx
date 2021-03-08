import React, {
  useRef,
  useState
} from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFileOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import MoreIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ArchiveIcon from '@material-ui/icons/ArchiveOutlined';
import EditIcon from '@material-ui/icons/Edit';
import type { Theme } from 'src/theme';
import bytesToSize from 'src/utils/bytesToSize';
import type { ProjectFile } from 'src/types/project';

interface FileCardProps {
  className?: string;
  file: ProjectFile;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  media: {
    height: 140
  },
  placeholder: {
    height: 140,
    backgroundColor: colors.blueGrey[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insertDriveFileIcon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    fontSize: theme.spacing(6)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  getAppIcon: {
    marignRight: theme.spacing(1)
  },
  menu: {
    width: 250,
    maxWidth: '100%'
  }
}));

const FileCard: FC<FileCardProps> = ({ className, file, ...rest }) => {
  const classes = useStyles();
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      {file.mimeType.includes('image/') ? (
        <CardMedia
          className={classes.media}
          image={file.url}
        />
      ) : (
        <div className={classes.placeholder}>
          <InsertDriveFileIcon className={classes.insertDriveFileIcon} />
        </div>
      )}
      <CardContent className={classes.content}>
        <div>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            {file.name}
          </Typography>
          <Typography
            variant="subtitle2"
            color="textPrimary"
          >
            {bytesToSize(file.size)}
          </Typography>
        </div>
        <div>
          <Tooltip title="More options">
            <IconButton
              edge="end"
              onClick={handleMenuOpen}
              ref={moreRef}
              size="small"
            >
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth>
          <GetAppIcon className={classes.getAppIcon} />
          Download
        </Button>
      </CardActions>
      <Menu
        anchorEl={moreRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        classes={{ paper: classes.menu }}
        onClose={handleMenuClose}
        elevation={1}
        open={openMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem divider>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
        <MenuItem divider>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText primary="Archive" />
        </MenuItem>
      </Menu>
    </Card>
  );
}

FileCard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  file: PropTypes.object.isRequired
};

export default FileCard;
