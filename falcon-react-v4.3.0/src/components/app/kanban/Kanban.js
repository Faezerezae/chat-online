import React, { useEffect, useState } from 'react';
import KanbanHeader from './KanbanHeader';
import KanbanContainer from './KanbanContainer';
import KanbanProvider from './KanbanProvider';
import { useAppContext } from 'Main';

const Kanban = () => {
    const {
        config: { isFluid, isNavbarVerticalCollapsed },
        setConfig
    } = useAppContext();
    const [kanbanIsFluid] = useState(isFluid);
    const [kanbanIsNavbarVerticalCollapsed] = useState(
        isNavbarVerticalCollapsed
    );

    useEffect(() => {
        setConfig('isFluid', true);
        setConfig('isNavbarVerticalCollapsed', true);

        return () => {
            setConfig('isFluid', kanbanIsFluid);
            setConfig(
                'isNavbarVerticalCollapsed',
                kanbanIsNavbarVerticalCollapsed
            );
        };
    }, []);

    return (
        <>
            <KanbanProvider>
                <KanbanHeader />
                <KanbanContainer />
            </KanbanProvider>
        </>
    );
};

export default Kanban;
