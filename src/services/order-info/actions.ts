import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '@utils/api';

export const fetchOrderByNumber = createAsyncThunk(
  'orderInfo/fetchOrderByNumber',
  getOrderByNumberApi
);
