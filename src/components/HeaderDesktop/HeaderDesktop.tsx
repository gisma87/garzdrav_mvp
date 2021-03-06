import React from 'react';
import './HeaderDesktop.scss'
import HeaderTop from "../HeaderTop";
import HeaderFixed from "../HeaderFixed";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const HeaderDesktop: React.FC = () => {

    return (
        <ErrorBoundary>
            <header className='HeaderDesktop'>
                <HeaderTop/>
                <HeaderFixed/>
                <HeaderSearch/>
            </header>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    height: 147,
                    marginBottom: 15
                }}>
            </div>
        </ErrorBoundary>
    )
}

export default HeaderDesktop