import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import IconButton from '@material-ui/core/IconButton';
import 'src/styles/pagination.css';

interface PropTypes {
    count: number;
    page: number;
    rowsPerPage: number;
    pagesCount: number;
    onPagesButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, pageNumber:number) => void;
    onFirstPageButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onBackButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onNextButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onLastPageButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const PaginationActions: React.FC<PropTypes> = (props) => {
    const { count, page, rowsPerPage, pagesCount, onPagesButtonClick, onFirstPageButtonClick, onBackButtonClick, onNextButtonClick, onLastPageButtonClick } = props;

    const pageButtons: JSX.Element[] = [];
    const start = Math.max(1, page - 2);
    for (let i = start; i < Math.min(start + 7, pagesCount); i++) {
        pageButtons.push(
            <IconButton
                key={i}
                size={'small'}
                disabled={i === page + 1}
                color={i === page + 1 ? 'primary' : 'default'}
                onClick={event => onPagesButtonClick(event, i - 1)}
            >
                <span className="numbers">{i}</span>
            </IconButton>
        );
    }

    return (
        <div className="root">
            <IconButton
                onClick={onFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                size={'small'}
            >
                <FirstPageIcon />
            </IconButton>

            <IconButton
                onClick={onBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                size={'small'}
            >
                <KeyboardArrowLeft />
            </IconButton>

            {pageButtons}

            <IconButton
                onClick={onNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                size={'small'}
            >
                <KeyboardArrowRight />
            </IconButton>

            <IconButton
                onClick={onLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                size={'small'}
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
};

export default PaginationActions;
