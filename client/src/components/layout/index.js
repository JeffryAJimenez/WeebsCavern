import React, { Fragment, useState } from "react";
import Navbar from './Navbar';
import Sidebar from './Sidebar';

//components
import CreatePostModal from "../modals/create-post";
import LoginPostModal from "../modals/login";
import SignUpPostModal from "../modals/signup";


const Layout = () => {

    const [isShowing_create_post, setIsShowing_create_post] = useState(false);
    const [isShowing_login, setIsShowing_login] = useState(false);
    const [isShowing_signup, setIsShowing_signup] = useState(false);

    const hide_create_post = () => {
        setIsShowing_create_post(false);
    };

    const hide_login = () => {
        setIsShowing_login(false);
    };

    const hide_signup = () => {
        setIsShowing_signup(false);
    };

    return (

        <Fragment>
            <CreatePostModal isShowing={isShowing_create_post} hide={hide_create_post} />
            <LoginPostModal isShowing={isShowing_login} hide={hide_login} />
            <SignUpPostModal isShowing={isShowing_signup} hide={hide_signup} />
            <Navbar setIsShowing={setIsShowing_login} setIsShowing_signup={setIsShowing_signup}/>
            <Sidebar setIsShowing={setIsShowing_create_post}/>
        </Fragment>
    )
};

export default Layout;