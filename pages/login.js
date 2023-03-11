/* eslint-disable react/react-in-jsx-scope */
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from '../styles/loginRegister.module.css';

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

const Login = () => {
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    });
    const { errors } = formState;
    const [serverErrors, setServerErrors] = useState({});

    const router = useRouter();

    const handleRegisterPage = (e) => {
        e.preventDefault();
        router.push("/register")
    };

    const onSubmit = async (data) => {  
        try {
            const response = await axios.post('./api/user/login', data);
            const redirectPath = router.query.redirect || '/';
            router.push(redirectPath);
        } catch (error) {
            if (error.response) {
                setServerErrors(error.response.data);
            } else {
                setServerErrors({ message: 'An error occurred. Please try again later.' });
            }
        }
    };

    return (
        <div>
            <div>
                <Head>
                    <title>Login Page</title>
                </Head>
            </div>
            <div className={styles.container}>
                <h1 className={styles.loginTitle}>Login</h1>
                <form className={styles.formInfo} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputInfo}>
                        <label className={styles.inputTitle} htmlFor="email">Email: </label>
                        <input 
                            className={styles.inputText} 
                            type="text" 
                            name="email" 
                            placeholder="Email"
                            {...register('email', { required: true })} 
                        /><br/>
                        {errors?.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.inputInfo}>
                        <label className={styles.inputTitle} htmlFor="password">Password: </label>
                        <input 
                            className={styles.inputText}
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            {...register('password', { required: true })} 
                        /><br/>
                        {errors?.password && <span className={styles.errorMsg}>{errors.password.message}</span>}
                    </div>

                    {serverErrors.message && <div className={styles.errorMsg}>{serverErrors.message}</div>}

                    <button className={styles.submitBtn} type="submit" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? 'Submitting...' : 'Login'}
                    </button>
                </form>                
                <p>
                    If you do not have an account, please 
                    <span className={styles.turnPage} onClick={handleRegisterPage}> register</span>.
                </p>
            </div>
        </div>
    )    
};

export default Login; 