export interface Movie {
  id: string;
  title: string;
  poster: string;
  price: number;
  provider: string;
}

export interface MoviePrice {
  provider: string;
  price: number;
}

export interface MovieDetail {
  title: string;
  poster: string;
  prices: MoviePrice[];
}

export interface MovieDetailItem {
  id: string;
  title: string;
  poster: string;
  price: number;
  provider: string;  
}

export interface MovieDetailViewModel {
  title: string;
  poster: string;
  prices: {
    provider: string;
    price: number;
  }[];
}