"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentUser,
  getStoredAuth,
  loginUser,
  registerUser,
  storeAuth,
  type Customer,
  type Product,
} from "@/services/api";

export type CartItem = {
  product: Product;
  quantity: number;
};

type AuthState = {
  customer: Customer | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

type WishlistState = {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: number;
};

type AppContextValue = {
  auth: AuthState;
  cart: CartState;
  wishlist: WishlistState;
};

const AppContext = createContext<AppContextValue | null>(null);

const CART_KEY = "anuvarnika_cart";
const WISHLIST_KEY = "anuvarnika_wishlist";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function readWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setCartItems(readCart());
      setWishlistItems(readWishlist());
    });

    const stored = getStoredAuth();
    if (!stored) {
      queueMicrotask(() => setAuthLoading(false));
      return;
    }
    queueMicrotask(() => {
      setCustomer(stored.customer);
      setToken(stored.token);
    });
    fetchCurrentUser(stored.token)
      .then(({ customer: fresh }) => setCustomer(fresh))
      .catch(() => {
        storeAuth(null);
        setCustomer(null);
        setToken(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    storeAuth(result);
    setCustomer(result.customer);
    setToken(result.token);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerUser({ name, email, password });
    storeAuth(result);
    setCustomer(result.customer);
    setToken(result.token);
  }, []);

  const logout = useCallback(() => {
    storeAuth(null);
    setCustomer(null);
    setToken(null);
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.stock < 1 || !Number.isInteger(quantity) || quantity < 1) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        );
      }
          return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const next = Math.max(1, Math.min(quantity, item.product.stock));
          return { ...item, quantity: next };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const removeWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const hasWishlist = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      auth: {
        customer,
        token,
        loading: authLoading,
        login,
        register,
        logout,
      },
      cart: {
        items: cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clear: clearCart,
        count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      },
      wishlist: {
        items: wishlistItems,
        toggle: toggleWishlist,
        remove: removeWishlist,
        has: hasWishlist,
        count: wishlistItems.length,
      },
    }),
    [
      customer,
      token,
      authLoading,
      login,
      register,
      logout,
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      wishlistItems,
      toggleWishlist,
      removeWishlist,
      hasWishlist,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
