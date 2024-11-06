import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Detalp.module.scss';
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../ProductCard';
import { useAddTodoMutation } from '../../../Redux/Slice/productApiSlice';

const Detalp = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { pubg_id } = useParams();
    const { userInfo } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [addTodo] = useAddTodoMutation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://shope-smoky.vercel.app/api/pubg/${pubg_id}`);
                const data = response.data;
                if (data && data.getById) {
                    setProduct(data.getById);
                } else {
                    setError('Ürün bulunamadı.');
                }
            } catch (error) {
                console.error('Ürün alınırken hata oluştu:', error);
                setError('Ürün detayları alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [pubg_id]);

    const handleAddToBag = async (e) => {
        e.preventDefault();
       

        try {
            const formData = new FormData();
            formData.append('title', product.title);
            formData.append('price', product.price);
            formData.append('email', userInfo.email); // User's email from auth state
            formData.append('thumbnail', product.thumbnail);
            formData.append('pubg_id', pubg_id);
            if (userInfo.photo) formData.append('photo', userInfo.photo); // Optional photo if available

            const newTodo = await addTodo(formData).unwrap();

            dispatch({ type: 'todo/addTodo', payload: newTodo });
            toast.success('Ürün başarıyla eklendi!');

            setTimeout(() => {
                navigate('/basket' || window.location.reload());
            }, 1000); // Dashboard yönlendirme
        } catch (err) {
            console.error('Failed to add the todo:', err);
            toast.error('Ürün eklenirken hata oluştu.');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Yükleniyor...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!product) {
        return <div className={styles.error}>Ürün bulunamadı.</div>;
    }

    return (
        <div className={styles.detailContent}>
            <div className={styles.productDetails}>
                <img src={product.thumbnail} alt={product.title} className={styles.image} />
                <div className={styles.info}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <p className={styles.price}>Fiyat: {product.price}$</p>
                    <p className={styles.description}>{product.description}</p>
                    <p className={styles.category}>Kategori: {product.catagory}</p>
                    <div className={styles.ratings}>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                    <div className={styles.btns}>
                        <button onClick={handleAddToBag}>Sifaris et</button>
                    </div>
                </div>
            </div>
            <div className={styles.otherProducts}>
                <h1>DİĞER ÜRÜNLERİMİZİ GÖRÜNTÜLE</h1>
                <div className={styles.cards}>
                    <ProductCard />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Detalp;
