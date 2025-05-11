"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { useState } from "react";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 1;

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;
  const [searchProduct, setSearcProduct] = useState("");

  const {
    data: queryResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.getInfiniteProducts.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.nextPage;

        return nextPage;
      },
    }
  );

  const products = queryResults?.pages.flatMap((page) => page.items);

  const visibleProducts = () => {
    return products?.filter((prod) => {
      if (
        prod.name
          .toLocaleLowerCase()
          .includes(searchProduct.toLocaleLowerCase())
      ) {
        return prod;
      }
    });
  };
  const newProducts = visibleProducts();

  // let map: (Product | null)[] = [];
  // if (products && products.length) {
  //   map = products;
  // } else if (isLoading) {
  //   map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  // }

  let map: (Product | null)[] = [];
  if (newProducts && newProducts.length) {
    map = newProducts;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <input
        style={{
          fontSize: 25,
          color: "#b717b4",
          display: "block",
          margin: "0 auto",
          padding: "5px",
          border: "2px black dashed",
          borderRadius: "5px",
        }}
        type="text"
        placeholder="Введите фамилию"
        value={searchProduct}
        onChange={(e) => setSearcProduct(e.target.value)}
      />

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
        {hasNextPage && (
          <button
            style={{
              backgroundColor: "#5e9cde",
              display: "block",
              margin: "0 auto",
              padding: "10px",
              width: "200px",
              marginTop: "30px",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={() => hasNextPage && fetchNextPage()}
          >
            Next Page
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductReel;
