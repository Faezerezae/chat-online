import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../axios/axiosConfig';
import PropTypes from 'prop-types';

const ResponseList = ({ categoryCannedResponse, onSelectResponse }) => {
    const [cannedResponses, setCannedResponses] = useState([]);

    useEffect(() => {
        const fetchResponses = async () => {
            const url =
                categoryCannedResponse === 'all'
                    ? '/cannedResponses'
                    : `/cannedResponses/${categoryCannedResponse}`;
            try {
                const result = await AxiosInstance.get(url);
                setCannedResponses(result.data);
            } catch (error) {
                console.error('Error fetching cannedResponses:', error);
            }
        };

        fetchResponses();
    }, [categoryCannedResponse]);

    return (
        <div>
            <h2>
                Canned Responses for{' '}
                {categoryCannedResponse === 'all'
                    ? 'All Categories'
                    : categoryCannedResponse}
            </h2>
            <ul>
                {cannedResponses.map((response, index) => (
                    <li
                        style={{
                            cursor: 'pointer'
                        }}
                        key={index}
                        onClick={() =>
                            onSelectResponse(response.cannedResponse)
                        }
                    >
                        {response.cannedResponse}
                    </li>
                ))}
            </ul>
        </div>
    );
};
ResponseList.propTypes = {
    categoryCannedResponse: PropTypes.string.isRequired,
    onSelectResponse: PropTypes.func.isRequired
};
export default ResponseList;
