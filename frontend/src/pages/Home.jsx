import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="overflow-hidden bg-gray-50">
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">

          {/* Hero Content */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Premium Eyewear
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              See The World
              <span className="block text-blue-600">
                In Your Style.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover stylish and comfortable eyewear designed
              for your everyday look. Find frames that match
              your personality and lifestyle.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <Link
                to="/products"
                className="rounded-xl bg-gray-900 px-7 py-4 text-center font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                Shop Now →
              </Link>

              <Link
                to="/products"
                className="rounded-xl border border-gray-300 bg-white px-7 py-4 text-center font-bold text-gray-800 transition duration-300 hover:border-blue-600 hover:text-blue-600"
              >
                Explore Collection
              </Link>

            </div>

            {/* Trust Stats */}
            <div className="mt-10 flex flex-wrap gap-8 border-t border-gray-200 pt-7">

              <div>
                <p className="text-2xl font-black">100%</p>
                <p className="text-sm text-gray-500">
                  Quality Frames
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">Fast</p>
                <p className="text-sm text-gray-500">
                  Delivery
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">Easy</p>
                <p className="text-sm text-gray-500">
                  Returns
                </p>
              </div>

            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex items-center justify-center">

            <div className="absolute h-80 w-80 rounded-full bg-blue-100 blur-3xl sm:h-96 sm:w-96" />

            <div className="relative flex h-[430px] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-[2rem] bg-white shadow-2xl">

              <div className="absolute right-6 top-6 z-10 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                New Collection
              </div>

              <img
  src="/images/Hero.jpg"
  alt="Premium eyewear"
  className="h-full w-full object-cover transition duration-500 hover:scale-105"
/>

            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Explore
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Shop By Category
          </h2>

          <p className="mt-4 text-gray-500">
            Find the perfect eyewear for your style and everyday needs.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {/* Eyeglasses */}
          <Link
            to="/products"
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 transition duration-300 hover:-translate-y-2 hover:bg-blue-50 hover:shadow-xl"
          >
            <div className="flex h-64 items-center justify-center overflow-hidden bg-white">

              <img
  src="/images/download (6).jpg"
  alt="Eyeglasses"
  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
/>

            </div>

            <div className="p-8">

              <h3 className="text-2xl font-black">
                Eyeglasses
              </h3>

              <p className="mt-2 text-gray-500">
                Stylish everyday frames made for comfort and confidence.
              </p>

              <div className="mt-6 font-bold text-blue-600">
                Explore →
              </div>

            </div>
          </Link>

          {/* Sunglasses */}
          <Link
            to="/products"
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 transition duration-300 hover:-translate-y-2 hover:bg-blue-50 hover:shadow-xl"
          >
            <div className="flex h-64 items-center justify-center overflow-hidden bg-white">

              <img
  src="/images/download (7).jpg"
  alt="Eyeglasses"
  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
/>

            </div>

            <div className="p-8">

              <h3 className="text-2xl font-black">
                Sunglasses
              </h3>

              <p className="mt-2 text-gray-500">
                Look cool while keeping your eyes protected from the sun.
              </p>

              <div className="mt-6 font-bold text-blue-600">
                Explore →
              </div>

            </div>
          </Link>

          {/* Computer Glasses */}
          <Link
            to="/products"
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 transition duration-300 hover:-translate-y-2 hover:bg-blue-50 hover:shadow-xl"
          >
            <div className="flex h-64 items-center justify-center overflow-hidden bg-white">

              <img
  src="/images/RAVAL colored lenses sunnies.jpg"
  alt="Eyeglasses"
  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
/>

            </div>

            <div className="p-8">

              <h3 className="text-2xl font-black">
                Computer Glasses
              </h3>

              <p className="mt-2 text-gray-500">
                Comfortable eyewear designed for your digital lifestyle.
              </p>

              <div className="mt-6 font-bold text-blue-600">
                Explore →
              </div>

            </div>
          </Link>

        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">

        <div className="overflow-hidden rounded-[2rem] bg-gray-900">

          <div className="grid items-center gap-10 px-8 py-12 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-16">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                New Arrivals
              </p>

              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
                Your Style.
                <span className="block text-blue-400">
                  Your Frames.
                </span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-gray-400">
                Upgrade your everyday look with our latest collection
                of stylish and comfortable eyewear.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-gray-900 transition hover:bg-blue-600 hover:text-white"
              >
                Shop New Arrivals →
              </Link>

            </div>

            <div className="flex justify-center">

              <div className="h-80 w-full max-w-md overflow-hidden rounded-3xl bg-white/10">

  <img
    src="/images/New Arrivals.jpg"
    alt="New eyewear collection"
    className="h-full w-full object-cover transition duration-500 hover:scale-105"
  />



              </div>

            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Why EyeeWear
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Made For Your Everyday
            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <span className="text-2xl">✓</span>
              </div>

              <h3 className="mt-6 text-xl font-black">
                Premium Quality
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Quality frames designed to look great and feel comfortable.
              </p>

            </div>

            <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <span className="text-2xl">→</span>
              </div>

              <h3 className="mt-6 text-xl font-black">
                Fast Delivery
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Get your favourite eyewear delivered quickly to your doorstep.
              </p>

            </div>

            <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <span className="text-2xl">↻</span>
              </div>

              <h3 className="mt-6 text-xl font-black">
                Easy Returns
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Simple and hassle-free returns for a worry-free experience.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="rounded-[2rem] bg-blue-600 px-8 py-14 text-center sm:px-12">

          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Find Your Perfect Look.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Explore our collection and discover eyewear made for you.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-gray-900 shadow-lg transition hover:-translate-y-1 hover:bg-gray-100"
          >
            Explore Eyewear →
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

          <div>

            <p className="text-xl font-black">
              Eye<span className="text-blue-600">eWear</span>
            </p>

            <p className="mt-1 text-sm text-gray-500">
              See better. Look better.
            </p>

          </div>

          <p className="text-sm text-gray-400">
            © 2026 EyeeWear. All rights reserved.
          </p>

        </div>
      </footer>

    </main>
  );
}

export default Home;