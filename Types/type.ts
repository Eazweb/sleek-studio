// types.ts
export interface MenuItem {
    id: string;
    title: string;
    link?: string;
    children?: MenuItem[];
  }
  
export const menuData: MenuItem[] = [
    {
      id: "new-arrivals",
      title: "New Arrivals",
      link: "/new-arrivals"
    },
    {
      id: "premium-wear",
      title: "Premium Wear",
      link: "/premium-wear"
    },
    {
      id: "shoes",
      title: "Shoes",
      link: "/shoes"
    },
    {
      id: "shop-by-category",
      title: "Shop by Category",
      children: [
        { id: "men", title: "Men", link: "/category/men" },
        { id: "women", title: "Women", link: "/category/women" },
        { id: "children", title: "Children", link: "/category/children" }
      ]
    },
    {
      id: "wishlist",
      title: "Wishlist",
      link: "/wishlist"
    },
    {
      id: "about",
      title: "About Sleek Studio",
      link: "/about"
    },
    {
      id: "contact",
      title: "Contact",
      link: "/contact"
    }
  ];