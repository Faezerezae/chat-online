import React from 'react';
import PropTypes from 'prop-types';

const CategoryList = ({
    categoriesCannedResponses,
    selectedCategory,
    onSelectCategory,
    responseCounts
}) => {
    return (
        <div>
            <h2>Categories</h2>
            <ul>
                <li
                    style={{
                        cursor: 'pointer',
                        fontWeight:
                            selectedCategory === 'all' ? 'bold' : 'normal'
                    }}
                    onClick={() => onSelectCategory('all')}
                >
                    All ({responseCounts.all || 0})
                </li>
                {categoriesCannedResponses.map(categoryCannedResponse => (
                    <li
                        key={categoryCannedResponse}
                        style={{
                            cursor: 'pointer',
                            fontWeight:
                                categoryCannedResponse === selectedCategory
                                    ? 'bold'
                                    : 'normal'
                        }}
                        onClick={() => onSelectCategory(categoryCannedResponse)}
                    >
                        {categoryCannedResponse} (
                        {responseCounts[categoryCannedResponse] || 0})
                    </li>
                ))}
            </ul>
        </div>
    );
};
CategoryList.propTypes = {
    categoriesCannedResponses: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCategory: PropTypes.string.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    responseCounts: PropTypes.objectOf(PropTypes.number).isRequired
};

export default CategoryList;
