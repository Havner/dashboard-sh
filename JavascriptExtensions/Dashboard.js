// ================= config ===================

const DBSH_classesWithDrs = ['Formula Pro', 'BMW M4 Class 1 2021'];

const DBSH_tyreWearColor = [50, 100];
const DBSH_tyreTempColorC = [30, 70, 110, 140];
const DBSH_brakeTempColorC = [100, 200, 400, 800];

const DBSH_tyrePressColorKPA_RF2  = [130, 150, 170, 190];
const DBSH_tyrePressColorBAR_AMS2 = [1.4, 1.7, 2.0, 2.2];
const DBSH_tyrePressColorPSI_AC   = [20, 25, 28, 30];

const DBSH_tyrePressColorPSI_ACC_WET = [28.5, 29.5, 31.0, 32.0];  // CDA
const DBSH_tyrePressColorPSI_ACC_GT3 = [26.3, 27.3, 27.9, 28.9];  // CDA
const DBSH_tyrePressColorPSI_ACC_GT4 = [25.8, 26.8, 27.4, 28.4];  // CDA

const DBSH_tyrePressColorPSI_ACC_CUP = [25, 26, 28, 29];  // intentionally relaxed, TODO
const DBSH_tyrePressColorPSI_ACC_ST  = [25, 26, 28, 29];  // intentionally relaxed, TODO
const DBSH_tyrePressColorPSI_ACC_CHL = [25, 26, 28, 29];  // intentionally relaxed, TODO
const DBSH_tyrePressColorPSI_ACC_TCX = [25, 26, 28, 29];  // intentionally relaxed, TODO

// ================= main function ===================

function DBSH_getGradient2(table, min, max, val)
{
	var mult = (table[1] - table[0]) / (max - min);
	var shift = table[0] / mult - min;

	return val / mult - shift;
}

function DBSH_getGradient4(table, min, mid, max, val)
{
	var gradient1 = [table[0], table[1]];
	var gradient2 = [table[2], table[3]];

	if (val < table[1])
		return DBSH_getGradient2(gradient1, min, mid, val);
	if (val > table [2])
		return DBSH_getGradient2(gradient2, mid, max, val);
	return mid;
}

function DBSH_getTirePressPSI(tyrePressProp)
{
	var press = $prop(tyrePressProp);
	var unitPress = $prop('TyrePressureUnit');
	if (unitPress == 'Kpa')
		press *= 0.145038;
	else if (unitPress == 'Bar')
		press *= 14.5038;
	return press;
}

function DBSH_getTirePressBAR(tyrePressProp)
{
	var press = $prop(tyrePressProp);
	var unitPress = $prop('TyrePressureUnit');
	if (unitPress == 'Psi')
		press *= 0.0689476;
	else if (unitPress == 'Kpa')
		press *= 0.01;
	return press;
}

function DBSH_getTirePressKPA(tyrePressProp)
{
	var press = $prop(tyrePressProp);
	var unitPress = $prop('TyrePressureUnit');
	if (unitPress == 'Psi')
		press *= 6.89476;
	else if (unitPress == 'Bar')
		press *= 100;
	return press;
}

function DBSH_getTime(lapProp, empty)
{
	var lap = $prop(lapProp);
	if (lap == '00:00:00')
		return empty;
	if (String(lap)[0] == '-')
		return empty;
	else
		return lap;
}

function DBSH_getSession()
{
	const sess = $prop('SessionTypeName');
	switch (sess) {
		case 'Practice':
		case 'PRACTICE':
			return 'Pract';
		case 'Qualify':
		case 'QUALIFY':
			return 'Quali';
		case 'Race':
		case 'RACE':
			return 'Race';
		case 'Test Day':
			return 'Test';
		case 'HOTLAP':
			return 'Hotlap';
		case 'TIME_ATTACK':
			return 'Attack';
	}
	return 'UNKN';
}

function DBSH_outlap()
{
	switch ($prop('DataCorePlugin.CurrentGame')) {
		case 'Automobilista2':
			if (!DBSH_getTime('CurrentLapTime', null))
				return true;
			return false;
		default:
			if ($prop('DataCorePlugin.Computed.Fuel_CurrentLapIsValidForTracking') == 0)
				return true;
			return false;
	}
}

function DBSH_deltaExist(lapProp)
{
	// If the current lap is outlap, the live deltas will be invalid
	if (DBSH_outlap()) {
		return false;
	}

	// If there is no valid time to compare to
	if (!DBSH_getTime(lapProp, null))
		return false;

	return true;
}

function DBSH_getDelta(lapProp, deltaProp, empty)
{
	if (!DBSH_deltaExist(lapProp))
		return empty;

	var delta = $prop(deltaProp);
	if (delta >= 100)
		return "+99.99";

	return format(delta, '0.00', 1);
}

function DBSH_showLapInvalid()
{
	if (DBSH_outlap())
		return 1;

	switch ($prop('DataCorePlugin.CurrentGame')) {
		case 'Automobilista2':
			if ($prop('DataCorePlugin.GameRawData.mLapInvalidated'))
				return 1;
			return 0;
		case 'AssettoCorsaCompetizione':
			if ($prop('DataCorePlugin.GameRawData.Graphics.isValidLap'))
				return 0;
			return 1;
	}

	return 0;
}

function DBSH_classSupportsDrs()
{
	const carClass = $prop('CarClass');
	for (var i = 0; i < DBSH_classesWithDrs.length; i++) {
		if (carClass == DBSH_classesWithDrs[i])
			return true;
	}
	return false;
}

function DBSH_hasDRS()
{
	var drs = false;
	switch ($prop('DataCorePlugin.CurrentGame')) {
		case 'AssettoCorsa':
			drs = $prop('DataCorePlugin.GameRawData.StaticInfo.hasDRS') ? true : false;
			break;
		case 'RFactor2':
			drs = DBSH_classSupportsDrs();
			break;
		case 'Automobilista2':
			drs = ($prop('DataCorePlugin.GameRawData.mDrsState') & 1) ? true : false;
			break;
	}
	return drs;
}

function DBSH_showDRS()
{
	if (!DBSH_hasDRS())
		return -1;

	switch ($prop('DataCorePlugin.CurrentGame')) {
		case 'AssettoCorsa':
		case 'RFactor2':
			if ($prop('DRSEnabled'))
				return 2;
			if ($prop('DRSAvailable'))
				return 1;
			break;
		case 'Automobilista2':
			if (($prop('DataCorePlugin.GameRawData.mDrsState') & 16))
				return 2;
			if (($prop('DataCorePlugin.GameRawData.mDrsState') & 12))
				return 1;
			break;
	}

	return 0;
}

// ================= ACC details =================

function DBSH_addZero(i)
{
	if (i < 10) {
		i = "0" + i
	}
	return i;
}

function DBSH_getClock()
{
	const seconds = $prop('DataCorePlugin.GameRawData.Graphics.clock');
	const date = new Date(seconds * 1000);

	const hours = date.getUTCHours().toString();
	const minutes = DBSH_addZero(date.getUTCMinutes());

	return hours + ':' + minutes;
}

function DBSH_getClass()
{
	const id = $prop('CarId');

	if (id == 'bmw_m2_cs_racing')
		return 'TCX';
	if (id == 'ferrari_488_challenge_evo')
		return 'CHL';

	if (id.search('huracan_st') >= 0)
		return 'ST';
	if (id.search('gt3_cup') >= 0)
		return 'CUP';

	if (id.search('gt4') >= 0)
		return 'GT4';

	return 'GT3';
}

function DBSH_getPressureGradient()
{
	const compound = $prop('DataCorePlugin.GameRawData.Graphics.TyreCompound');
	if (compound == 'wet_compound')
		return DBSH_tyrePressColorPSI_ACC_WET;

	const cl = DBSH_getClass();
	switch (cl) {
	case 'GT3':
		return DBSH_tyrePressColorPSI_ACC_GT3;
	case 'GT4':
		return DBSH_tyrePressColorPSI_ACC_GT4;
	case 'CUP':
		return DBSH_tyrePressColorPSI_ACC_CUP;
	case 'ST':
		return DBSH_tyrePressColorPSI_ACC_ST;
	case 'CHL':
		return DBSH_tyrePressColorPSI_ACC_CHL;
	case 'TCX':
		return DBSH_tyrePressColorPSI_ACC_TCX;
	}

	// fallback not required, getClass() fallbacks to GT3
}

function DBSH_getTC1Available()
{
	const cl = DBSH_getClass();
	switch (cl) {
		case "CUP":
			return false;
	}

	return true;
}

function DBSH_getTC2Available()
{
	const cl = DBSH_getClass();

	switch (cl) {
		case "GT4":
		case "CUP":
		case "ST":
		case "TCX":
			return false;
	}

	const id = $prop('CarId');

	switch(id) {
		case "amr_v12_vantage_gt3":
		case "audi_r8_lms":
		case "audi_r8_lms_evo":
		case "bentley_continental_gt3_2016":
		case "bentley_continental_gt3_2018":
		case "bmw_m4_gt3":
		case "bmw_m6_gt3":
		case "jaguar_g3":
		case "lamborghini_huracan_gt3":
		case "lamborghini_huracan_gt3_evo":
		case "lexus_rc_f_gt3":
		case "mclaren_650s_gt3":
		case "mclaren_720s_gt3":
		case "mercedes_amg_gt3":
		case "mercedes_amg_gt3_evo":
		case "nissan_gt_r_gt3_2017":
		case "nissan_gt_r_gt3_2018":
		case "porsche_991_gt3_r":
		case "lamborghini_gallardo_rex":
			return false;
	}

	return true;
}

function DBSH_getEngMapAvailable()
{
	const cl = DBSH_getClass();

	switch (cl) {
		case "GT4":
		case "CUP":
		case "ST":
		case "TCX":
			return false;
	}

	return true;
}

// this function is constantly being implemented in SimHub itself, this is for
// either new or forgotten cars that don't have a correct offset in SH yet
function DBSH_getBrakeBias()
{
	const bb = $prop('BrakeBias');
	const id = $prop('CarId');

	var offset = 0.0;

	switch(id) {
		case "audi_r8_lms_evo_ii":
		case "lamborghini_huracan_st":
		case "lamborghini_huracan_st_evo2":
			offset = -14;
			break;
		case "porsche_992_gt3_cup":
			offset = -5;
			break;
		case "ferrari_488_challenge_evo":
			offset = -13;
			break;
		case "bmw_m2_cs_racing":
			offset = -17;
			break;
	}

	return bb + offset;
}
