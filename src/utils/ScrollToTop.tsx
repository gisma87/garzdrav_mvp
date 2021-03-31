import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import ym from 'react-yandex-metrika';

export default function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        // window.scrollTo(0, 0);
        ym('hit', pathname);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    return null;
}