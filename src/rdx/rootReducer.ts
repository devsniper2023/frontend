import { combineReducers, Reducer } from 'redux';

import * as localSettings from 'src/rdx/localSettings/localSettings.reducer';
import * as poolCoins from 'src/rdx/poolCoins/poolCoins.reducer';
import * as donors from 'src/rdx/topDonors/topDonors.reducer';
import * as topMiners from 'src/rdx/topMiners/topMiners.reducer';
import * as poolHashrate from 'src/rdx/poolHashrate/poolHashrate.reducer';
import * as minerHeaderStats from 'src/rdx/minerHeaderStats/minerHeaderStats.reducer';
import * as minerDetails from 'src/rdx/minerDetails/minerDetails.reducer';
import * as minerStats from 'src/rdx/minerStats/minerStats.reducer';
import * as minerWorkers from 'src/rdx/minerWorkers/minerWorkers.reducer';
import * as minerPayments from 'src/rdx/minerPayments/minerPayments.reducer';
import * as snacks from 'src/rdx/snacks/snacks.reducer';
import { localStorage } from 'src/utils/localStorage';

export const defaultReduxState = {
  localSettings: localSettings.defaultState,
  poolCoins: poolCoins.defaultState,
  donors: donors.defaultState,
  topMiners: topMiners.defaultState,
  poolHashrate: poolHashrate.defaultState,
  minerHeaderStats: minerHeaderStats.defaultState,
  minerDetails: minerDetails.defaultState,
  minerStats: minerStats.defaultState,
  minerWorkers: minerWorkers.defaultState,
  minerPayments: minerPayments.defaultState,
  snacks: snacks.defaultState,
};

const combinedReducer = combineReducers({
  localSettings: localSettings.reducer,
  poolCoins: poolCoins.reducer,
  donors: donors.reducer,
  topMiners: topMiners.reducer,
  poolHashrate: poolHashrate.reducer,
  minerHeaderStats: minerHeaderStats.reducer,
  minerDetails: minerDetails.reducer,
  minerStats: minerStats.reducer,
  minerWorkers: minerWorkers.reducer,
  minerPayments: minerPayments.reducer,
  snacks: snacks.reducer,
});

export type AppState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer = (state, action) => {
  const nextState = combinedReducer(state, action);

  // save localSettings to app_state
  if (action.type.startsWith('@localSettings')) {
    localStorage('app_state').set({
      localSettings: nextState.localSettings,
    });
  }

  return nextState;
};

export default rootReducer;
