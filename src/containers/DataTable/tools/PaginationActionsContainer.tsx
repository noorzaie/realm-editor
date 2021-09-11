import React from 'react';
import PaginationActions from 'src/components/DataTable/tools/PaginationActions';
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions';

interface PropTypes {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => void;
}

class PaginationActionsContainer extends React.Component<PropTypes> {
    handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.onPageChange(event, 0);
    };

    handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { page, onPageChange } = this.props;

        onPageChange(event, page - 1);
    };

    handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { page, onPageChange } = this.props;

        onPageChange(event, page + 1);
    };

    handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { count, rowsPerPage, onPageChange } = this.props;

        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    handlePagesButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, pageNumber:number) => {
        this.props.onPageChange(event, pageNumber);
    };

    render() {
        const { page, count, rowsPerPage } = this.props;
        const pagesCount = Math.ceil(count / rowsPerPage) + 1;

        return (
            <PaginationActions
                page={page}
                count={count}
                rowsPerPage={rowsPerPage}
                pagesCount={pagesCount}
                onPagesButtonClick={this.handlePagesButtonClick}
                onFirstPageButtonClick={this.handleFirstPageButtonClick}
                onBackButtonClick={this.handleBackButtonClick}
                onNextButtonClick={this.handleNextButtonClick}
                onLastPageButtonClick={this.handleLastPageButtonClick}
            />
        );
    }
}

export default PaginationActionsContainer as unknown as React.ElementType<TablePaginationActionsProps>;
