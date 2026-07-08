import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrderApi } from '@utils/api';

export const createOrder = createAsyncThunk('order/createOrder', createOrderApi);
