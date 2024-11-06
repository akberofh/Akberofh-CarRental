import React, { useEffect } from "react";
import styles from './Basket.module.scss';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setTodos,removeTodo } from '../../Redux/Slice/productSlice';
import { useGetTodosQuery, useAddTodoMutation,useDeleteTodoMutation } from '../../Redux/Slice/productApiSlice';

const Basket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: todos, error, isLoading } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const userInfo = useSelector(state => state.auth.userInfo);
  const [deleteTodo] = useDeleteTodoMutation();


  useEffect(() => {
    if (todos) {
      dispatch(setTodos(todos));
       
    
    }
  }, [todos, dispatch]);

  // Aynı başlığa sahip ürünleri birleştirerek gösterilecek listeyi oluşturuyoruz
  const uniqueProducts = todos ? todos.reduce((acc, product) => {
    const existingProduct = acc.find(item => item.title === product.title);
    if (existingProduct) {
      existingProduct.count += (product.count || 1); // count varsa artır, yoksa 1 olarak ayarla
    } else {
      acc.push({ ...product, count: 1 }); // Yeni ürün ekle ve count değerini 1 olarak ayarla
    }
    return acc;
  }, []) : [];

  // Toplam ürün sayısını hesapla
  const totalItemCount = uniqueProducts.reduce((acc, item) => acc + item.count, 0);

  const handleIncreaseQuantity = async (product) => {
    try {
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('price', product.price);
      formData.append('email', userInfo.email);
      formData.append('thumbnail', product.thumbnail);
      formData.append('pubg_id', product.pubg_id);

      const newTodo = await addTodo(formData).unwrap();
      dispatch({ type: 'todo/addTodo', payload: newTodo });

      toast.success('Ürün başarıyla artdirildi.');

      setTimeout(() => {
        window.location.reload();
      }, 2000); 

    } catch (err) {
      console.error('Failed to add the todo:', err);
      toast.error('Ürün eklenirken hata oluştu.');
    }
  };

    const handleDecreaseQuantity = async (id) => {
        try {
          await deleteTodo(id).unwrap();
          toast.success('onaylandi.');

          dispatch(removeTodo(id));

          setTimeout(() => {
            window.location.reload();
          }, 2000); 


        } catch (err) {
          console.error('Failed to delete the todo:', err);
        }
      };
  

  return (
    <div className={styles.basketList}>
      <h2>Sepetiniz ({totalItemCount} ürün)</h2>
      <ul>
        {isLoading && <p>Yükleniyor...</p>}
        {error && <p>Ürünler yüklenirken bir hata oluştu.</p>}
        {uniqueProducts.map((item) => (
          <li key={item.title}>
            <img src={item.thumbnail} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>Fiyat: {item.price}$</p>
              <p>Adet: {item.count}</p>
              <button onClick={() => handleIncreaseQuantity(item)}>Arttır</button>
              {item.count === 1 ? (
                <button onClick={() => handleDecreaseQuantity(item._id)}>Sil</button>
              ) : (
                <button onClick={() => handleDecreaseQuantity(item._id)}>Azalt</button>
              )}
              <button onClick={() => navigate('/basket/payment', { state: { itemPrice: item.price } })}>Ödeme yap</button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Basket;
