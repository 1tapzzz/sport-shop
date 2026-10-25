import React, { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { categories, slides } from "./data";


const API_URL = "http://localhost:8000/api";


function getCookie(name) {
  const cookies = document.cookie
    ? document.cookie.split(";")
    : [];

  for (const cookie of cookies) {
    const value = cookie.trim();

    if (value.startsWith(`${name}=`)) {
      return decodeURIComponent(
        value.substring(name.length + 1)
      );
    }
  }

  return null;
}


async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("csrftoken");

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  // Для запросов, изменяющих данные, передаём CSRF-токен.
  if (
    !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method) &&
    csrfToken
  ) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  const data =
    response.status === 204
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || `Ошибка сервера: ${response.status}`
    );
  }

  return data;
}

function formatPrice(value) {
  return Number(value ?? 0).toLocaleString("ru-RU");
}


function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    price: Number(product.price),
    image: product.image_url,
    category: product.category || "Без категории",
    badge: "",
    oldPrice: null,
  };
}

/* ================= HEADER ================= */

function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">

        <Link to="/" className="logo">
          SPORT<span>ZONE</span>
        </Link>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Главная
          </Link>

          <Link
            to="/catalog"
            className={location.pathname === "/catalog" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Каталог
          </Link>

          <Link
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Профиль
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/profile" className="icon-btn">
            👤
          </Link>

          <Link
            to="/cart"
            className="icon-btn cart"
            aria-label="Открыть корзину"
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          <button
            className="burger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

      </div>
    </header>
  );
}

/* ================= FOOTER ================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div>
          <div className="footer-logo">
            SPORT<span>ZONE</span>
          </div>

          <p>
            Спортивная одежда, обувь и экипировка
            для активной жизни.
          </p>
        </div>

        <div>
          <h3>Покупателям</h3>
          <a href="#">Доставка</a>
          <a href="#">Оплата</a>
          <a href="#">Возврат</a>
          <a href="#">Помощь</a>
        </div>

        <div>
          <h3>Компания</h3>
          <a href="#">О нас</a>
          <a href="#">Контакты</a>
          <a href="#">Магазины</a>
          <a href="#">Вакансии</a>
        </div>

        <div>
          <h3>Мы в соцсетях</h3>
          <div className="socials">
            <span>VK</span>
            <span>TG</span>
            <span>YT</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 SPORTZONE. Все права защищены.
      </div>
    </footer>
  );
}

/* ================= SLIDER ================= */

function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="slider">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${
            index === current ? "slide-active" : ""
          }`}
          style={{
            backgroundImage: `url(${slide.image})`
          }}
        >
          <div className="slide-overlay" />

          <div className="slide-content">
            <span className="slide-label">
              SPORTZONE
            </span>

            <h1>{slide.title}</h1>

            <p>{slide.text}</p>

            <Link to="/catalog" className="primary-btn">
              {slide.button}
            </Link>
          </div>
        </div>
      ))}

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={index === current ? "dot active" : "dot"}
          />
        ))}
      </div>

    </section>
  );
}

/* ================= PRODUCT CARD ================= */

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">
            Изображение скоро появится
          </div>
        )}

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          className="favorite"
          aria-label="Добавить в избранное"
        >
          ♡
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">
          {product.category}
        </div>

        <h3>{product.name}</h3>

        <div className="rating">
          ★★★★★ <span>4.9</span>
        </div>

        <div className="price-row">
          <strong>
            {formatPrice(product.price)} ₽
          </strong>

          {product.oldPrice != null && (
            <del>
              {formatPrice(product.oldPrice)} ₽
            </del>
          )}
        </div>

        <button
          type="button"
          className="add-cart"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </article>
  );
}
/* ================= HOME ================= */

function Home({ addToCart, products }) {
  return (
    <>
      <Slider />

      <section className="container">

        <div className="section-header">
          <div>
            <span className="section-label">
              КАТЕГОРИИ
            </span>

            <h2>
              Выбирай свой спорт
            </h2>
          </div>

          <Link to="/catalog" className="more-link">
            Все категории →
          </Link>
        </div>

        <div className="categories">

          {categories.map((category) => (
            <Link
              to="/catalog"
              className="category-card"
              key={category.name}
            >
              <img
                src={category.image}
                alt={category.name}
              />

              <div className="category-overlay">
                <span>{category.icon}</span>
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}

        </div>

        <div className="section-header products-heading">
          <div>
            <span className="section-label">
              ПОПУЛЯРНОЕ
            </span>

            <h2>
              Хиты продаж
            </h2>
          </div>

          <Link to="/catalog" className="more-link">
            Смотреть все →
          </Link>
        </div>

        <div className="products-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>

      </section>

      <section className="promo">

        <div className="promo-content">
          <span>SPORTZONE CLUB</span>

          <h2>
            Получай больше
            <br />
            с каждой покупкой
          </h2>

          <p>
            Регистрируйся и получай персональные
            предложения и скидки.
          </p>

          <Link to="/profile" className="white-btn">
            Создать аккаунт
          </Link>
        </div>

      </section>
    </>
  );
}

/* ================= CATALOG ================= */

function Catalog({ addToCart, products }) {
  const [category, setCategory] = useState("Все");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      category === "Все" ||
      product.category === category;

    const searchMatch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <main className="container catalog">

      <div className="catalog-top">
        <div>
          <span className="section-label">
            SPORTZONE
          </span>

          <h1>Каталог</h1>
        </div>

        <div className="search">
          🔎
          <input
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <div className="filters">

        {["Все", "Обувь", "Одежда", "Аксессуары"].map(
          (item) => (
            <button
              key={item}
              className={
                category === item
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          )
        )}

      </div>

      <div className="catalog-count">
        Найдено товаров: {filteredProducts.length}
      </div>

      <div className="products-grid catalog-grid">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}

      </div>

    </main>
  );
}

/* ================= CART ================= */

function CartPage({
  cart,
  onChangeQuantity,
  onRemoveItem,
  busyItemId,
  isAuthenticated,
  onCheckout,
}) {
  const items = cart?.items || [];
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentResult, setPaymentResult] = useState("success");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError("");
    setCheckoutMessage("");
    setSubmitting(true);

    try {
      const result = await onCheckout({
        full_name: fullName.trim(),
        address: address.trim(),
        payment_result: paymentResult,
      });

      setCheckoutMessage(`${result.message} Номер заказа: ${result.order_id}.`);

      if (result.status === "paid") {
        setFullName("");
        setAddress("");
      }
    } catch (err) {
      setCheckoutError(err.message || "Не удалось оформить заказ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container cart-page">
      <div className="catalog-top">
        <div>
          <span className="section-label">SPORTZONE</span>
          <h1>Корзина</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <h2>Корзина пока пуста</h2>
          <p>Добавь товары из нашего каталога.</p>
          <Link to="/catalog" className="primary-btn">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                    />
                  ) : (
                    <span>Нет фото</span>
                  )}
                </div>

                <div className="cart-item-details">
                  <h3>{item.product.title}</h3>
                  <p>{formatPrice(item.product.price)} ₽ за штуку</p>

                  <div className="cart-controls">
                    <button
                      type="button"
                      disabled={busyItemId === item.id || item.quantity <= 1}
                      onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      disabled={busyItemId === item.id}
                      onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="cart-remove"
                      disabled={busyItemId === item.id}
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <strong className="cart-item-total">
                  {formatPrice(item.line_total)} ₽
                </strong>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Ваш заказ</h2>
            <p>Количество товаров: {cart.count}</p>
            <div className="cart-total-row">
              <span>Итого</span>
              <strong>{formatPrice(cart.total)} ₽</strong>
            </div>

            {!isAuthenticated ? (
              <p>
                Чтобы оформить заказ, сначала <Link to="/profile">войдите в аккаунт</Link>.
              </p>
            ) : (
              <form onSubmit={handleCheckout}>
                <h3>Доставка</h3>

                <label htmlFor="checkout-name">Имя получателя</label>
                <input
                  id="checkout-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ваше имя"
                  maxLength={200}
                  required
                />

                <label htmlFor="checkout-address">Адрес доставки</label>
                <textarea
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом"
                  maxLength={300}
                  required
                  rows={3}
                />

                <label htmlFor="payment-result">Результат демооплаты</label>
                <select
                  id="payment-result"
                  value={paymentResult}
                  onChange={(e) => setPaymentResult(e.target.value)}
                >
                  <option value="success">Успешная оплата</option>
                  <option value="fail">Оплата не прошла</option>
                </select>

                <p>Это демонстрация: настоящие банковские данные не нужны.</p>

                {checkoutError && (
                  <p role="alert" style={{ color: "#d32f2f" }}>
                    {checkoutError}
                  </p>
                )}

                {checkoutMessage && (
                  <p role="status" style={{ color: "#218838" }}>
                    {checkoutMessage}
                  </p>
                )}

                <button type="submit" className="primary-btn full" disabled={submitting}>
                  {submitting ? "Оформляем..." : "Оформить заказ"}
                </button>
              </form>
            )}

            <Link to="/catalog" className="more-link">
              Продолжить покупки
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

/* ================= AUTH ================= */

function Profile({ onAuthChange }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // При открытии профиля проверяем, сохранился ли вход на сервере.
  useEffect(() => {
    let active = true;

    apiRequest("/auth/profile/")
      .then((data) => {
        if (active && data.is_authenticated) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        if (active) {
          setError("Не удалось проверить профиль: " + err.message);
        }
      })
      .finally(() => {
        if (active) setCheckingProfile(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setSubmitting(true);

      const isLogin = mode === "login";
      const data = await apiRequest(
        isLogin ? "/auth/login/" : "/auth/register/",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      setMessage(
        data.message ||
          (isLogin ? "Вход выполнен успешно!" : "Регистрация прошла успешно!")
      );
      setPassword("");

      const profileData = await apiRequest("/auth/profile/");

      if (profileData.is_authenticated) {
        setUser(profileData.user);
        onAuthChange(true);
      } else {
        setMode("login");
      }
    } catch (err) {
      setError(
        err.message ||
          (mode === "login"
            ? "Не удалось войти в аккаунт."
            : "Не удалось зарегистрироваться.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/logout/", { method: "POST" });
      setUser(null);
      setMode("login");
      onAuthChange(false);
      setMessage(data.message || "Вы вышли из аккаунта.");
      setPassword("");
    } catch (err) {
      setError(err.message || "Не удалось выйти из аккаунта.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingProfile) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="auth-description">Проверяем аккаунт...</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">👤</div>
          <h1>Личный кабинет</h1>
          <p className="auth-description">Вы вошли в аккаунт SPORTZONE</p>
          <p><strong>Email:</strong> {user.email}</p>
          {error && (
            <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>
          )}
          <button
            type="button"
            className="primary-btn full"
            onClick={handleLogout}
            disabled={submitting}
          >
            {submitting ? "Подождите..." : "Выйти из аккаунта"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">👤</div>

        <h1>{mode === "login" ? "Вход" : "Регистрация"}</h1>

        <p className="auth-description">
          {mode === "login"
            ? "Войдите в свой аккаунт SPORTZONE"
            : "Создайте аккаунт SPORTZONE"}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Пароль</label>
          <input
            type="password"
            placeholder="Минимум 8 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && (
            <p role="alert" style={{ color: "#d32f2f" }}>
              {error}
            </p>
          )}

          {message && (
            <p role="status" style={{ color: "#218838" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn full"
            disabled={submitting}
          >
            {submitting
              ? "Подождите..."
              : mode === "login"
                ? "Войти"
                : "Создать аккаунт"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
              setMessage("");
            }}
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* ================= APP ================= */


export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    count: 0,
    total: "0.00",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Загружаем товары и проверяем авторизацию.
  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const productData = await apiRequest("/products/");
        if (active) {
          setProducts(productData.map(normalizeProduct));
        }
      } catch (err) {
        if (active) {
          setError("Не удалось загрузить товары: " + err.message);
        }
      }

      try {
        const profileData = await apiRequest("/auth/profile/");
        const loggedIn = Boolean(profileData.is_authenticated);

        if (active) {
          setIsAuthenticated(loggedIn);
          setAuthChecked(true);
        }

        // Корзину загружаем только для вошедшего пользователя.
        if (loggedIn) {
          const cartData = await apiRequest("/cart/");
          if (active) setCart(cartData);
        } else if (active) {
          setCart({ items: [], count: 0, total: "0.00" });
        }
      } catch (err) {
        if (active) {
          setCart({ items: [], count: 0, total: "0.00" });
          // Не показываем гостю техническую ошибку авторизации.
          console.info("Корзина недоступна без входа в аккаунт.");
        }
      } finally {
        if (active) {
          setAuthChecked(true);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Обновляем состояние после входа или выхода в профиле.
  const handleAuthChange = (loggedIn) => {
    setIsAuthenticated(loggedIn);

    if (!loggedIn) {
      setCart({ items: [], count: 0, total: "0.00" });
    } else {
      apiRequest("/cart/")
        .then((data) => setCart(data))
        .catch(() => {
          setCart({ items: [], count: 0, total: "0.00" });
        });
    }
  };

  // Добавление товара.
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert("Войдите в аккаунт, чтобы добавлять товары в корзину.");
      return;
    }

    try {
      const updatedCart = await apiRequest("/cart/items/", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      setCart(updatedCart);
      alert(`${product.name} добавлен в корзину`);
    } catch (err) {
      alert(
        "Не удалось добавить товар. Проверьте, что вы вошли в аккаунт."
      );
    }
  };

  // Изменение количества.
  const changeCartQuantity = async (itemId, quantity) => {
    try {
      setBusyItemId(itemId);

      const updatedCart = await apiRequest(
        `/cart/items/${itemId}/`,
        {
          method: "PATCH",
          body: JSON.stringify({ quantity }),
        }
      );

      setCart(updatedCart);
    } catch (err) {
      alert("Не удалось изменить количество. Проверьте вход в аккаунт.");
    } finally {
      setBusyItemId(null);
    }
  };

  // Удаление товара.
  const removeFromCart = async (itemId) => {
    try {
      setBusyItemId(itemId);

      const updatedCart = await apiRequest(
        `/cart/items/${itemId}/`,
        { method: "DELETE" }
      );

      setCart(updatedCart);
    } catch (err) {
      alert("Не удалось удалить товар. Проверьте вход в аккаунт.");
    } finally {
      setBusyItemId(null);
    }
  };

  // Оформление заказа через Django API.
  const checkout = async (orderData) => {
    const result = await apiRequest("/checkout/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    // После успешной демооплаты сервер очищает корзину.
    const updatedCart = await apiRequest("/cart/");
    setCart(updatedCart);

    return result;
  };

  return (
    <div className="app">
      <Header cartCount={isAuthenticated ? cart.count : 0} />

      {loading && (
        <div className="container api-status">
          Загружаем товары...
        </div>
      )}

      {error && (
        <div className="container api-status api-error" role="alert">
          {error}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/catalog"
          element={
            <Catalog
              products={products}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              isAuthenticated={authChecked && isAuthenticated}
              onChangeQuantity={changeCartQuantity}
              onRemoveItem={removeFromCart}
              busyItemId={busyItemId}
              onCheckout={checkout}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile onAuthChange={handleAuthChange} />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
