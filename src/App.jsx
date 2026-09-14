import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import { products, categories, slides } from "./data";

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

          <button className="icon-btn cart">
            🛒
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

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

        <img src={product.image} alt={product.name} />

        <span className="product-badge">
          {product.badge}
        </span>

        <button className="favorite">
          ♡
        </button>

      </div>

      <div className="product-info">

        <div className="product-category">
          {product.category}
        </div>

        <h3>{product.name}</h3>

        <div className="rating">
          ★★★★★
          <span>4.9</span>
        </div>

        <div className="price-row">
          <strong>
            {product.price.toLocaleString()} ₽
          </strong>

          <del>
            {product.oldPrice.toLocaleString()} ₽
          </del>
        </div>

        <button
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

function Home({ addToCart }) {
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

function Catalog({ addToCart }) {
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

/* ================= AUTH ================= */

function Profile() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      mode === "login"
        ? "Вы успешно вошли!"
        : "Аккаунт создан!"
    );
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          👤
        </div>

        <h1>
          {mode === "login"
            ? "Вход"
            : "Регистрация"}
        </h1>

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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Пароль</label>

          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button className="primary-btn full">
            {mode === "login"
              ? "Войти"
              : "Создать аккаунт"}
          </button>

        </form>

        <div className="auth-switch">

          {mode === "login"
            ? "Нет аккаунта?"
            : "Уже есть аккаунт?"}

          <button
            onClick={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
          >
            {mode === "login"
              ? "Зарегистрироваться"
              : "Войти"}
          </button>

        </div>

      </div>

    </main>
  );
}

/* ================= APP ================= */

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);

    alert(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="app">

      <Header cartCount={cart.length} />

      <Routes>

        <Route
          path="/"
          element={
            <Home addToCart={addToCart} />
          }
        />

        <Route
          path="/catalog"
          element={
            <Catalog addToCart={addToCart} />
          }
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

      <Footer />

    </div>
  );
}