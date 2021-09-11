import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { emptyFunctionType } from 'src/types/genericTypes';
import 'src/styles/sideBar.css';

export interface PropTypes {
    isOpen: boolean;
    onCloseIconClick: emptyFunctionType;
}

const SideBar: React.FC<PropTypes> = props => {
    const { isOpen, onCloseIconClick } = props;

    return (
        <Drawer
            className="drawer"
            variant="persistent"
            anchor="left"
            open={isOpen}
            classes={{ paper: 'drawerPaper' }}
        >
            <div className="drawerHeader">
                <IconButton
                    size="small"
                    onClick={onCloseIconClick}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </div>

            <Divider />

            {props.children}
        </Drawer>
    );
};

export default SideBar;
