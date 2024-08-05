import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ProductProvider from 'components/app/e-commerce/ProductProvider';
import CourseProvider from 'components/app/e-learning/CourseProvider';
import ModalAuth from 'components/authentication/modal/ModalAuth';

import { useAppContext } from 'Main';
import NavbarVertical from './sidebarVertical/NavbarVertical';

const MainLayoutSettingChat = () => {
    const { hash, pathname } = useLocation();
    const isKanban = pathname.includes('kanban');

    const {
        config: { isFluid, navbarPosition }
    } = useAppContext();

    useEffect(() => {
        setTimeout(() => {
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({
                        block: 'start',
                        behavior: 'smooth'
                    });
                }
            }
        }, 0);
    }, []);
    return (
        <div className={isFluid ? 'container-fluid' : 'container'}>
            {(navbarPosition === 'vertical' || navbarPosition === 'combo') && (
                <NavbarVertical />
            )}
            <ProductProvider>
                <CourseProvider>
                    <div
                        className={classNames('content', { 'pb-0': isKanban })}
                    >
                        <Outlet />
                    </div>
                </CourseProvider>
            </ProductProvider>
            <ModalAuth />
        </div>
    );
};

export default MainLayoutSettingChat;
