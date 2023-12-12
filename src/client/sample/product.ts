import { ISO8601DateTime } from "@/types/common";
import { db } from "firebase-instanse";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore/lite";
import useSWR from "swr";
import { fetchApi } from "../base";

export interface IProduct {
  id: number;
  code: string;
  brand: string;
  name: string;
  price: number;
  status: string;
  description?: string;
  css?: string;
  js?: string;
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
}

export interface IProductFormValue extends Omit<IProduct, "id" | "createdAt" | "updatedAt"> {}

interface IProductsParams {
  page?: number;
}

export interface IProductsResponse {
  code: number;
  message: string;
  data: {
    items: IProduct[];
    page: {
      currentPage: number;
      pageSize: number;
      totalPage: number;
      totalCount: number;
    };
  };
}

export interface IProductResponse {
  code: number;
  message: string;
  data: IProduct;
}

export const getProducts = async (searchText: string, type: string, status: string[]) => {
  const userCollection = collection(db, "user");
  const queries: any[] = [];

  if (status.length === 1) {
    if (status[0] === "USER") {
      queries.push(where("is_counselor", "==", false));
    } else {
      queries.push(where("is_counselor", "==", true));
    }
  }

  // if (searchText !== "") {
  //   const endWith = searchText + "\uf8ff";
  //   if (type === "email") {
  //     queries.push(and(where("email", "<=", endWith), where("email", ">=", searchText)));
  //   } else {
  //     queries.push(and(where("display_name", "<=", endWith), where("display_name", ">=", searchText)));
  //   }
  // }

  console.log(queries);

  const q = query(userCollection, ...queries);
  const users = await getDocs(q);

  return users.docs
    .filter((e) => {
      console.log(e.data().display_name);
      if (type === "email") {
        return e.data().email ? e.data().email.includes(searchText) : "".includes(searchText);
      } else {
        return e.data().display_name ? e.data().display_name.includes(searchText) : "".includes(searchText);
      }
    })
    .map((e, index) => {
      const data = e.data();
      data["id"] = index + 1;
      return data;
    });
};

export const getCounselor = async () => {
  const counselorCollection = collection(db, "counseling_log");

  const q = query(counselorCollection, orderBy("created_at", "desc"));
  const users = await getDocs(q);

  console.log(users);

  const dataList: any[] = [];

  for (var e of users.docs) {
    const data = e.data();

    const counselorRef = doc(db, data.counselor_ref.path);
    const counselor = await getDoc(counselorRef);
    const counselorData = counselor.data();

    const userRef = doc(db, data.user_ref.path);
    const user = await getDoc(userRef);
    const userData = user.data();

    dataList.push({
      ...data,
      counselorData,
      userData,
    });
  }

  return dataList;
};

export const useProduct = (id: string | number) => {
  return useSWR<IProductResponse>(`api/sample/products/${id}`);
};

export const createProduct = (value: IProductFormValue) => {
  return fetchApi.post(`api/sample/products`, { body: JSON.stringify(value) });
};

export const updateProduct = (id: string, value: IProductFormValue) => {
  return fetchApi.put(`api/sample/products/${id}`, { body: JSON.stringify(value) });
};
