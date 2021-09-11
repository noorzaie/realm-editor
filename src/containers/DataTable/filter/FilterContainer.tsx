import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ObjectSchemaProperty } from 'realm';
import Filter from 'src/components/DataTable/filter/Filter';
import {
    AggregationType,
    BooleanOperatorType,
    DataTypes, FilterType,
    OperatorType
} from 'src/types/dbTypes';
import DB from 'src/lib/db/DB';
import { isDataTypePrimitive } from 'src/utils/dbUtils';
import { emptyFunctionType, FilterGroupType } from 'src/types/genericTypes';
import { RootState } from 'src/store';
import { setFilter } from 'src/store/table';

const mapState = (state: RootState) => ({
    columns: state.table.columns,
    currentCollection: state.database.currentCollection,
    currentDatabase: state.database.currentDatabase,
    filter: state.table.filter
});

const mapDispatch = {
    setFilter
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

type ItemType = {
    aggregations: AggregationType[];
    operators: OperatorType[];
    relationFields?: string[];
};

type TypeOperatorsType = {
    [key in DataTypes]?: ItemType;
}

const typeOperators: TypeOperatorsType = {
    bool: {
        aggregations: [],
        operators: [ '=', '==', '!=', '<>' ]
    },
    int: {
        aggregations: [],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ]
    },
    float: {
        aggregations: [],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ]
    },
    decimal128: {
        aggregations: [],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ]
    },
    objectId: {
        aggregations: [],
        operators: [ '=', '==', '!=', '<>', 'BEGINSWITH', 'CONTAINS', 'ENDSWITH', 'LIKE' ]
    },
    double: {
        aggregations: [],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ]
    },
    string: {
        aggregations: [ '@size' ],
        operators: [ '=', '==', '!=', '<>', 'BEGINSWITH', 'CONTAINS', 'ENDSWITH', 'LIKE' ]
    },
    data: {
        aggregations: [ '@size' ],
        operators: [ '=', '==', '!=', '<>', 'BEGINSWITH', 'CONTAINS', 'ENDSWITH', 'LIKE' ]
    },
    date: {
        aggregations: [],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ]
    },
    list: {
        aggregations: [ '@count', '@size', '@min', '@max', '@sum', '@avg' ],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ], // or change according to selected relation field type
        relationFields: [] //
    }, // object type
    object: {
        aggregations: [],
        operators: [], // set according to selected relation field type
        relationFields: [] //
    },
    linkingObjects: {
        aggregations: [ '@count', '@size', '@min', '@max', '@sum', '@avg' ],
        operators: [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ], // or change according to selected relation field type
        relationFields: [] //
    }
};

interface StateTypes {
    groups: FilterGroupType[];
}

interface PropTypes {
    onFilterButtonClick: emptyFunctionType;
}

const sampleFilter: FilterType = {
    fields: [],
    aggregations: [],
    operators: [],
    relationFields: [],
    selectedField: '',
    selectedAggregation: '',
    selectedOperator: '',
    selectedRelationField: '',
    operator: 'and',
    value: ''
};

const sampleGroup: FilterGroupType = {
    filters: [ sampleFilter ],
    operator: 'and'
};

class FilterContainer extends React.Component<PropTypes & ReduxPropTypes, StateTypes> {
    state: StateTypes = {
        groups: []
    };

    DBInstance = DB.getInstance();

    generateQueryString() {
        const queries: string[] = [];
        const groups = this.state.groups;
        groups.map(({ filters, operator: groupOperator }, groupIndex) => {
            const temp: string[] = [];
            filters.map(({ selectedField, selectedAggregation, selectedOperator, selectedRelationField, value, operator: filterOperator }, filterIndex) => {
                if (selectedField && selectedOperator && value) {
                    if (filterIndex > 0 && temp.length > 0) {
                        temp.push(filterOperator);
                    }
                    temp.push(`${selectedField}${selectedAggregation ? `.${selectedAggregation}` : ''}${selectedRelationField ? `.${selectedRelationField}` : ''} ${selectedOperator} ${value}`);
                }
            });
            if (groupIndex > 0 && temp.length > 0) {
                queries.push(groupOperator);
            }
            if (temp.length > 0) {
                queries.push(`(${temp.join(' ')})`);
            }
        });

        this.props.setFilter(queries.join(' '));
    }

    componentDidMount(): void {
        this.initializeGroups();
    }

    componentDidUpdate(prevProps: Readonly<PropTypes> & ReduxPropTypes) {
        const { columns, currentCollection, currentDatabase } = this.props;

        if (
            JSON.stringify(columns) !== JSON.stringify(prevProps.columns) || // initial load
            currentCollection !== prevProps.currentCollection || currentDatabase !== prevProps.currentDatabase
        ) {
            this.initializeGroups();
        }
    }

    initializeGroups = () => {
        const fields: string[] = Object.entries(this.props.columns).map(([ name ]) => name);
        sampleGroup.filters[0].fields = fields;

        this.setState({
            groups: [ JSON.parse(JSON.stringify(sampleGroup)) ]
        });
    }

    getRelationFields = (field: string): string[] => {
        const schema = this.props.columns[field] as ObjectSchemaProperty;
        if (schema.type === 'object' || schema.type === 'linkingObjects' || (schema.type === 'list' && !isDataTypePrimitive(schema.objectType as string))) {
            return this.DBInstance.getCollectionFields(schema.objectType as string, false);
        } else {
            return [];
        }
    };

    getOperators = (field: string, relationField: string, hasAggregation: boolean): OperatorType[] => {
        const { columns } = this.props;

        if (hasAggregation) {
            return [ '=', '==', '<=', '<', '>=', '>', '!=', '<>' ];
        } else if (relationField.length > 0) {
            return (typeOperators[
                DB.getInstance().getFieldType(
                    (columns[field] as ObjectSchemaProperty).objectType as string, relationField
                ) as DataTypes
            ] as ItemType).operators;
        } else {
            return (typeOperators[(columns[field] as ObjectSchemaProperty).type as DataTypes] as ItemType).operators;
        }
    };

    updateGroup = (groupIndex: number, modifiedGroup?: FilterGroupType, filterIndex?: number, modifiedFilter?: FilterType) => {
        this.setState(prevState => {
            const groups = prevState.groups;
            if (modifiedGroup === undefined) {
                modifiedGroup = {
                    filters: [
                        ...groups[groupIndex].filters.slice(0, filterIndex),
                        modifiedFilter as FilterType,
                        ...groups[groupIndex].filters.slice(filterIndex as number + 1)
                    ],
                    operator: groups[groupIndex].operator
                };
            }
            return {
                ...prevState,
                groups: [
                    ...groups.slice(0, groupIndex),
                    modifiedGroup,
                    ...groups.slice(groupIndex + 1)
                ]
            };
        }, () => this.generateQueryString());
    }

    handleFieldChange = (selectedField: string, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            selectedField: selectedField,
            aggregations: selectedField === '' ? [] : (typeOperators[(this.props.columns[selectedField] as ObjectSchemaProperty).type as DataTypes] as ItemType).aggregations,
            operators: selectedField === '' ? [] : this.getOperators(selectedField, groups[groupIndex].filters[filterIndex].selectedRelationField, groups[groupIndex].filters[filterIndex].selectedAggregation.length > 0),
            relationFields: selectedField === '' ? [] : this.getRelationFields(selectedField),
            selectedAggregation: '',
            selectedOperator: '',
            selectedRelationField: ''
        });
    };

    handleAggregationChange = (aggregation: AggregationType, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            selectedAggregation: aggregation,
            selectedOperator: '',
            operators: this.getOperators(groups[groupIndex].filters[filterIndex].selectedField, groups[groupIndex].filters[filterIndex].selectedRelationField, aggregation.length > 0)
        });
    };

    handleOperatorChange = (operator: OperatorType, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            selectedOperator: operator
        });
    };

    handleRelationFieldChange = (relationField: string, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        const field = groups[groupIndex].filters[filterIndex].selectedField;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            selectedRelationField: relationField,
            selectedOperator: '',
            operators: this.getOperators(field, relationField, false)
        });
    };

    handleValueChange = (value: string, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            value
        });
    };

    handleAddGroupButtonClick = (groupIndex: number) => {
        this.setState(prevState => {
            const groups = prevState.groups;

            return {
                ...prevState,
                groups: [
                    ...groups.slice(0, groupIndex + 1),
                    JSON.parse(JSON.stringify(sampleGroup)),
                    ...groups.slice(groupIndex + 1)
                ]
            };
        });
    };

    handleRemoveGroupButtonClick = (index: number) => {
        if (index === 0 && this.state.groups.length === 1) {
            this.props.setFilter('');
            this.initializeGroups();
        } else {
            this.setState(prevState => {
                const groups = prevState.groups;

                return {
                    ...prevState,
                    groups: [
                        ...groups.slice(0, index),
                        ...groups.slice(index + 1)
                    ]
                };
            }, () => this.generateQueryString());
        }
    };

    handleAddFilterButtonClick = (groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, {
            filters: [
                ...groups[groupIndex].filters.slice(0, filterIndex + 1),
                JSON.parse(JSON.stringify(sampleFilter)),
                ...groups[groupIndex].filters.slice(filterIndex + 1)
            ],
            operator: groups[groupIndex].operator
        });
    };

    handleRemoveFilterButtonClick = (groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, {
            filters: [
                ...groups[groupIndex].filters.slice(0, filterIndex),
                ...groups[groupIndex].filters.slice(filterIndex + 1)
            ],
            operator: groups[groupIndex].operator
        });
    };

    handleGroupOperatorChange = (event: React.ChangeEvent<{ value: unknown }>, groupIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, {
            filters: groups[groupIndex].filters,
            operator: event.target.value as BooleanOperatorType
        });
    };

    handleFilterOperatorChange = (operator: BooleanOperatorType, groupIndex: number, filterIndex: number) => {
        const groups = this.state.groups;
        this.updateGroup(groupIndex, undefined, filterIndex, {
            ...groups[groupIndex].filters[filterIndex],
            operator
        });
    };

    handleQueryStringChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.props.setFilter(event.target.value as string);
    };

    handleFilterSubmit = () => {
        this.props.onFilterButtonClick();
    };

    render() {
        const { filter } = this.props;
        const { groups } = this.state;

        return <Filter
            groups={groups}
            queryString={filter}
            onAddFilterButtonClick={this.handleAddFilterButtonClick}
            onAddGroupButtonClick={this.handleAddGroupButtonClick}
            onAggregationChange={this.handleAggregationChange}
            onFieldChange={this.handleFieldChange}
            onFilterOperatorChange={this.handleFilterOperatorChange}
            onFilterSubmit={this.handleFilterSubmit}
            onGroupOperatorChange={this.handleGroupOperatorChange}
            onOperatorChange={this.handleOperatorChange}
            onQueryStringChange={this.handleQueryStringChange}
            onRelationFieldChange={this.handleRelationFieldChange}
            onRemoveFilterButtonClick={this.handleRemoveFilterButtonClick}
            onRemoveGroupButtonClick={this.handleRemoveGroupButtonClick}
            onValueChange={this.handleValueChange}
        />;
    }
}

export default connector(FilterContainer);
