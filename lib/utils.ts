// lib/utils.ts
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const modifierByDays: ModifierByDays = {
	1: 1,
	2: 1.00268,
	3: 1.005367182,
	4: 1.008061566,
	5: 1.010763171,
	6: 1.013472017,
	7: 1.016188122,
	8: 1.018911506,
	9: 1.021642189,
	10: 1.02438019,
	11: 1.027125529,
	12: 1.029878225,
	13: 1.032638299,
	14: 1.035405769,
	15: 1.038180657,
	16: 1.040962981,
	17: 1.043752762,
	18: 1.046550019,
	19: 1.049354773,
	20: 1.052167044,
	21: 1.054986852,
	22: 1.057814217,
	23: 1.060649159,
	24: 1.063491698,
	25: 1.066341856,
	26: 1.069199652,
	27: 1.072065107,
	28: 1.074938242,
	29: 1.077819076,
	30: 1.080707631,
	31: 1.083603928,
	32: 1.086507986,
	33: 1.089419828,
	34: 1.092339473,
	35: 1.095266943,
	36: 1.098202258,
	37: 1.10114544,
	38: 1.10409651,
	39: 1.107055489,
	40: 1.110022397,
	41: 1.112997257,
	42: 1.11598009,
	43: 1.118970917,
	44: 1.121969759,
	45: 1.124976638,
	46: 1.127991575,
	47: 1.131014593,
	48: 1.134045712,
	49: 1.137084954,
	50: 1.140132342,
	51: 1.143187896,
	52: 1.14625164,
	53: 1.149323594,
	54: 1.152403782,
	55: 1.155492224,
	56: 1.158588943,
	57: 1.161693961,
	58: 1.164807301,
	59: 1.167928985,
	60: 1.171059034,
	61: 1.174197473,
	62: 1.177344322,
	63: 1.180499605,
	64: 1.183663344,
	65: 1.186835561,
	66: 1.190016281,
	67: 1.193205524,
	68: 1.196403315,
	69: 1.199609676,
	70: 1.20282463,
	71: 1.2060482,
	72: 1.209280409,
	73: 1.212521281,
	74: 1.215770838,
	75: 1.219029103,
	76: 1.222296101,
	77: 1.225571855,
	78: 1.228856388,
	79: 1.232149723,
	80: 1.235451884,
	81: 1.238762895,
	82: 1.24208278,
	83: 1.245411561,
	84: 1.248749264,
	85: 1.252095912,
	86: 1.255451529,
	87: 1.25881614,
	88: 1.262189767,
	89: 1.265572435,
	90: 1.518964169,
	91: 1.523034993,
	92: 1.527116727,
	93: 1.5312094,
	94: 1.535313041,
	95: 1.53942768,
	96: 1.543553346,
	97: 1.547690069,
	98: 1.551837879,
	99: 1.555996804,
	100: 1.560166876,
	101: 1.564348123,
	102: 1.568540576,
	103: 1.572744265,
	104: 1.576959219,
	105: 1.58118547,
	106: 1.585423047,
	107: 1.589671981,
	108: 1.593932302,
	109: 1.59820404,
	110: 1.602487227,
	111: 1.606781893,
	112: 1.611088068,
	113: 1.615405784,
	114: 1.619735072,
	115: 1.624075962,
	116: 1.628428485,
	117: 1.632792674,
	118: 1.637168558,
	119: 1.64155617,
	120: 1.64595554,
	121: 1.650366701,
	122: 1.654789684,
	123: 1.65922452,
	124: 1.663671242,
	125: 1.668129881,
	126: 1.672600469,
	127: 1.677083038,
	128: 1.681577621,
	129: 1.686084249,
	130: 1.690602955,
	131: 1.695133771,
	132: 1.699676729,
	133: 1.704231863,
	134: 1.708799204,
	135: 1.713378786,
	136: 1.717970641,
	137: 1.722574803,
	138: 1.727191303,
	139: 1.731820176,
	140: 1.736461454,
	141: 1.74111517,
	142: 1.745781359,
	143: 1.750460053,
	144: 1.755151286,
	145: 1.759855092,
	146: 1.764571503,
	147: 1.769300555,
	148: 1.77404228,
	149: 1.778796714,
	150: 1.783563889,
	151: 1.78834384,
	152: 1.793136602,
	153: 1.797942208,
	154: 1.802760693,
	155: 1.807592091,
	156: 1.812436438,
	157: 1.817293768,
	158: 1.822164115,
	159: 1.827047515,
	160: 1.831944002,
	161: 1.836853612,
	162: 1.84177638,
	163: 1.846712341,
	164: 1.85166153,
	165: 1.856623983,
	166: 1.861599735,
	167: 1.866588822,
	168: 1.87159128,
	169: 1.876607145,
	170: 1.881636452,
	171: 1.886679238,
	172: 1.891735538,
	173: 1.896805389,
	174: 1.901888828,
	175: 1.90698589,
	176: 1.912096612,
	177: 1.917221031,
	178: 1.922359183,
	179: 1.927511106,
	180: 2.432676836,
	181: 2.43919641,
	182: 2.445733456,
	183: 2.452288022,
	184: 2.458860153,
	185: 2.465449899,
	186: 2.472057304,
	187: 2.478682418,
	188: 2.485325287,
	189: 2.491985959,
	190: 2.498664481,
	191: 2.505360902,
	192: 2.512075269,
	193: 2.518807631,
	194: 2.525558035,
	195: 2.532326531,
	196: 2.539113166,
	197: 2.545917989,
	198: 2.552741049,
	199: 2.559582395,
	200: 2.566442076,
	201: 2.573320141,
	202: 2.580216639,
	203: 2.587131619,
	204: 2.594065132,
	205: 2.601017227,
	206: 2.607987953,
	207: 2.614977361,
	208: 2.6219855,
	209: 2.629012421,
	210: 2.636058174,
	211: 2.64312281,
	212: 2.650206379,
	213: 2.657308933,
	214: 2.66443052,
	215: 2.671571194,
	216: 2.678731005,
	217: 2.685910004,
	218: 2.693108243,
	219: 2.700325773,
	220: 2.707562646,
	221: 2.714818914,
	222: 2.722094629,
	223: 2.729389842,
	224: 2.736704607,
	225: 2.744038975,
	226: 2.751393,
	227: 2.758766733,
	228: 2.766160228,
	229: 2.773573537,
	230: 2.781006714,
	231: 2.788459812,
	232: 2.795932885,
	233: 2.803425985,
	234: 2.810939167,
	235: 2.818472484,
	236: 2.82602599,
	237: 2.833599739,
	238: 2.841193787,
	239: 2.848808186,
	240: 2.856442992,
	241: 2.864098259,
	242: 2.871774043,
	243: 2.879470397,
	244: 2.887187378,
	245: 2.89492504,
	246: 2.902683439,
	247: 2.910462631,
	248: 2.91826267,
	249: 2.926083614,
	250: 2.933925518,
	251: 2.941788439,
	252: 2.949672432,
	253: 2.957577554,
	254: 2.965503862,
	255: 2.973451412,
	256: 2.981420262,
	257: 2.989410468,
	258: 2.997422088,
	259: 3.00545518,
	260: 3.013509799,
	261: 3.021586006,
	262: 3.029683856,
	263: 3.037803409,
	264: 3.045944722,
	265: 3.054107854,
	266: 3.062292863,
	267: 3.070499808,
	268: 3.078728747,
	269: 3.08697974,
	270: 3.095252846,
	271: 3.103548124,
	272: 3.111865633,
	273: 3.120205433,
	274: 3.128567583,
	275: 3.136952144,
	276: 3.145359176,
	277: 3.153788739,
	278: 3.162240892,
	279: 3.170715698,
	280: 3.179213216,
	281: 3.187733507,
	282: 3.196276633,
	283: 3.204842655,
	284: 3.213431633,
	285: 3.22204363,
	286: 3.230678707,
	287: 3.239336926,
	288: 3.248018349,
	289: 3.256723038,
	290: 3.265451055,
	291: 3.274202464,
	292: 3.282977327,
	293: 3.291775706,
	294: 3.300597665,
	295: 3.309443267,
	296: 3.318312575,
	297: 3.327205652,
	298: 3.336122564,
	299: 3.345063372,
	300: 3.354028142,
	301: 3.363016937,
	302: 3.372029823,
	303: 3.381066863,
	304: 3.390128122,
	305: 3.399213665,
	306: 3.408323558,
	307: 3.417457865,
	308: 3.426616652,
	309: 3.435799985,
	310: 3.445007929,
	311: 3.45424055,
	312: 3.463497914,
	313: 3.472780089,
	314: 3.48208714,
	315: 3.491419133,
	316: 3.500776136,
	317: 3.510158216,
	318: 3.51956544,
	319: 3.528997876,
	320: 3.53845559,
	321: 3.547938651,
	322: 3.557447127,
	323: 3.566981085,
	324: 3.576540594,
	325: 3.586125723,
	326: 3.59573654,
	327: 3.605373114,
	328: 3.615035514,
	329: 3.624723809,
	330: 3.634438069,
	331: 3.644178363,
	332: 3.653944761,
	333: 3.663737333,
	334: 3.673556149,
	335: 3.683401279,
	336: 3.693272795,
	337: 3.703170766,
	338: 3.713095264,
	339: 3.723046359,
	340: 3.733024123,
	341: 3.743028628,
	342: 3.753059944,
	343: 3.763118145,
	344: 3.773203302,
	345: 3.783315487,
	346: 3.793454772,
	347: 3.803621231,
	348: 3.813814936,
	349: 3.82403596,
	350: 3.834284376,
	351: 3.844560258,
	352: 3.85486368,
	353: 3.865194714,
	354: 3.875553436,
	355: 3.88593992,
	356: 3.896354239,
	357: 3.906796468,
	358: 3.917266682,
	359: 3.927764957,
	360: 4.938291367,
	361: 4.951525988,
	362: 4.964796078,
	363: 4.978101731,
	364: 4.991443044,
	365: 5.004820111,
	366: 5.018233029,
	367: 5.031681894,
	368: 5.045166801,
	369: 5.058687848,
	370: 5.072245132,
	371: 5.085838749,
	372: 5.099468796,
	373: 5.113135373,
	374: 5.126838576,
	375: 5.140578503,
	376: 5.154355253,
	377: 5.168168925,
	378: 5.182019618,
	379: 5.195907431,
	380: 5.209832463,
	381: 5.223794814,
	382: 5.237794584,
	383: 5.251831873,
	384: 5.265906783,
	385: 5.280019413,
	386: 5.294169865,
	387: 5.30835824,
	388: 5.32258464,
	389: 5.336849167,
	390: 5.351151923,
	391: 5.36549301,
	392: 5.379872531,
	393: 5.39429059,
	394: 5.408747288,
	395: 5.423242731,
	396: 5.437777022,
	397: 5.452350264,
	398: 5.466962563,
	399: 5.481614022,
	400: 5.496304748,
	401: 5.511034845,
	402: 5.525804418,
	403: 5.540613574,
	404: 5.555462418,
	405: 5.570351058,
	406: 5.585279598,
	407: 5.600248148,
	408: 5.615256813,
	409: 5.630305701,
	410: 5.64539492,
	411: 5.660524579,
	412: 5.675694785,
	413: 5.690905647,
	414: 5.706157274,
	415: 5.721449775,
	416: 5.736783261,
	417: 5.75215784,
	418: 5.767573623,
	419: 5.78303072,
	420: 5.798529242,
	421: 5.814069301,
	422: 5.829651006,
	423: 5.845274471,
	424: 5.860939807,
	425: 5.876647125,
	426: 5.89239654,
	427: 5.908188162,
	428: 5.924022107,
	429: 5.939898486,
	430: 5.955817414,
	431: 5.971779005,
	432: 5.987783372,
	433: 6.003830632,
	434: 6.019920898,
	435: 6.036054286,
	436: 6.052230911,
	437: 6.06845089,
	438: 6.084714339,
	439: 6.101021373,
	440: 6.11737211,
	441: 6.133766668,
	442: 6.150205162,
	443: 6.166687712,
	444: 6.183214435,
	445: 6.19978545,
	446: 6.216400875,
	447: 6.233060829,
	448: 6.249765432,
	449: 6.266514804,
	450: 6.283309063,
	451: 6.300148331,
	452: 6.317032729,
	453: 6.333962377,
	454: 6.350937396,
	455: 6.367957908,
	456: 6.385024035,
	457: 6.4021359,
	458: 6.419293624,
	459: 6.436497331,
	460: 6.453747144,
	461: 6.471043186,
	462: 6.488385582,
	463: 6.505774455,
	464: 6.523209931,
	465: 6.540692133,
	466: 6.558221188,
	467: 6.575797221,
	468: 6.593420358,
	469: 6.611090724,
	470: 6.628808447,
	471: 6.646573654,
	472: 6.664386471,
	473: 6.682247027,
	474: 6.700155449,
	475: 6.718111866,
	476: 6.736116405,
	477: 6.754169197,
	478: 6.772270371,
	479: 6.790420055,
	480: 6.808618381,
	481: 6.826865478,
	482: 6.845161478,
	483: 6.863506511,
	484: 6.881900708,
	485: 6.900344202,
	486: 6.918837125,
	487: 6.937379608,
	488: 6.955971785,
	489: 6.97461379,
	490: 6.993305755,
	491: 7.012047814,
	492: 7.030840102,
	493: 7.049682754,
	494: 7.068575904,
	495: 7.087519687,
	496: 7.10651424,
	497: 7.125559698,
	498: 7.144656198,
	499: 7.163803876,
	500: 7.183002871,
	501: 7.202253319,
	502: 7.221555357,
	503: 7.240909126,
	504: 7.260314762,
	505: 7.279772406,
	506: 7.299282196,
	507: 7.318844272,
	508: 7.338458775,
	509: 7.358125844,
	510: 7.377845622,
	511: 7.397618248,
	512: 7.417443865,
	513: 7.437322614,
	514: 7.457254639,
	515: 7.477240081,
	516: 7.497279085,
	517: 7.517371793,
	518: 7.537518349,
	519: 7.557718898,
	520: 7.577973585,
	521: 7.598282554,
	522: 7.618645951,
	523: 7.639063923,
	524: 7.659536614,
	525: 7.680064172,
	526: 7.700646744,
	527: 7.721284477,
	528: 7.74197752,
	529: 7.762726019,
	530: 7.783530125,
	531: 7.804389986,
	532: 7.825305751,
	533: 7.84627757,
	534: 7.867305594,
	535: 7.888389973,
	536: 7.909530858,
	537: 7.930728401,
	538: 7.951982753,
	539: 7.973294067,
	540: 9.994662495,
	541: 10.02144819,
	542: 10.04830567,
	543: 10.07523513,
	544: 10.10223676,
	545: 10.12931076,
	546: 10.15645731,
	547: 10.18367661,
	548: 10.21096887,
	549: 10.23833426,
	550: 10.265773,
	551: 10.29328527,
	552: 10.32087128,
	553: 10.34853121,
	554: 10.37626527,
	555: 10.40407367,
	556: 10.43195658,
	557: 10.45991423,
	558: 10.4879468,
	559: 10.51605449,
	560: 10.54423752,
	561: 10.57249608,
	562: 10.60083037,
	563: 10.62924059,
	564: 10.65772696,
	565: 10.68628966,
	566: 10.71492892,
	567: 10.74364493,
	568: 10.7724379,
	569: 10.80130803,
	570: 10.83025554,
	571: 10.85928062,
	572: 10.88838349,
	573: 10.91756436,
	574: 10.94682344,
	575: 10.97616092,
	576: 11.00557703,
	577: 11.03507198,
	578: 11.06464597,
	579: 11.09429922,
	580: 11.12403195,
	581: 11.15384435,
	582: 11.18373665,
	583: 11.21370907,
	584: 11.24376181,
	585: 11.27389509,
	586: 11.30410913,
	587: 11.33440414,
	588: 11.36478034,
	589: 11.39523796,
	590: 11.42577719,
	591: 11.45639828,
	592: 11.48710142,
	593: 11.51788686,
	594: 11.54875479,
	595: 11.57970546,
	596: 11.61073907,
	597: 11.64185585,
	598: 11.67305602,
	599: 11.70433981,
	600: 11.73570744,
	601: 11.76715914,
	602: 11.79869512,
	603: 11.83031563,
	604: 11.86202087,
	605: 11.89381109,
	606: 11.9256865,
	607: 11.95764734,
	608: 11.98969384,
	609: 12.02182622,
	610: 12.05404471,
	611: 12.08634955,
	612: 12.11874097,
	613: 12.15121919,
	614: 12.18378446,
	615: 12.216437,
	616: 12.24917705,
	617: 12.28200485,
	618: 12.31492062,
	619: 12.34792461,
	620: 12.38101705,
	621: 12.41419817,
	622: 12.44746822,
	623: 12.48082744,
	624: 12.51427606,
	625: 12.54781432,
	626: 12.58144246,
	627: 12.61516072,
	628: 12.64896935,
	629: 12.68286859,
	630: 12.71685868,
	631: 12.75093986,
	632: 12.78511238,
	633: 12.81937648,
	634: 12.85373241,
	635: 12.88818041,
	636: 12.92272074,
	637: 12.95735363,
	638: 12.99207934,
	639: 13.02689811,
	640: 13.0618102,
	641: 13.09681585,
	642: 13.13191531,
	643: 13.16710885,
	644: 13.2023967,
	645: 13.23777912,
	646: 13.27325637,
	647: 13.3088287,
	648: 13.34449636,
	649: 13.38025961,
	650: 13.4161187,
	651: 13.4520739,
	652: 13.48812546,
	653: 13.52427364,
	654: 13.56051869,
	655: 13.59686088,
	656: 13.63330047,
	657: 13.66983771,
	658: 13.70647288,
	659: 13.74320622,
	660: 13.78003802,
	661: 13.81696852,
	662: 13.85399799,
	663: 13.89112671,
	664: 13.92835493,
	665: 13.96568292,
	666: 14.00311095,
	667: 14.04063929,
	668: 14.0782682,
	669: 14.11599796,
	670: 14.15382883,
	671: 14.1917611,
	672: 14.22979501,
	673: 14.26793087,
	674: 14.30616892,
	675: 14.34450945,
	676: 14.38295274,
	677: 14.42149905,
	678: 14.46014867,
	679: 14.49890187,
	680: 14.53775892,
	681: 14.57672012,
	682: 14.61578573,
	683: 14.65495603,
	684: 14.69423132,
	685: 14.73361186,
	686: 14.77309794,
	687: 14.81268984,
	688: 14.85238785,
	689: 14.89219225,
	690: 14.93210332,
	691: 14.97212136,
	692: 15.01224664,
	693: 15.05247947,
	694: 15.09282011,
	695: 15.13326887,
	696: 15.17382603,
	697: 15.21449188,
	698: 15.25526672,
	699: 15.29615084,
	700: 15.33714452,
	701: 15.37824807,
	702: 15.41946177,
	703: 15.46078593,
	704: 15.50222084,
	705: 15.54376679,
	706: 15.58542408,
	707: 15.62719302,
	708: 15.6690739,
	709: 15.71106701,
	710: 15.75317267,
	711: 15.79539118,
	712: 15.83772282,
	713: 15.88016792,
	714: 15.92272677,
	715: 15.96539968,
	716: 16.00818695,
	717: 16.05108889,
	718: 16.09410581,
	719: 16.13723801,
	720: 20.18048581,
	721: 20.23456951,
	722: 20.28879816,
	723: 20.34317214,
	724: 20.39769184,
	725: 20.45235765,
	726: 20.50716997,
	727: 20.56212919,
	728: 20.61723569,
	729: 20.67248989,
	730: 20.72789216,
	731: 20.78344291,
	732: 20.83914254,
	733: 20.89499144,
	734: 20.95099002,
	735: 21.00713867,
	736: 21.0634378,
	737: 21.11988781,
	738: 21.17648911,
	739: 21.2332421,
	740: 21.29014719,
	741: 21.34720479,
	742: 21.4044153,
	743: 21.46177913,
	744: 21.5192967,
	745: 21.57696841,
	746: 21.63479469,
	747: 21.69277594,
	748: 21.75091258,
	749: 21.80920502,
	750: 21.86765369,
	751: 21.926259,
	752: 21.98502138,
	753: 22.04394124,
	754: 22.103019,
	755: 22.16225509,
	756: 22.22164993,
	757: 22.28120396,
	758: 22.34091758,
	759: 22.40079124,
	760: 22.46082536,
	761: 22.52102037,
	762: 22.58137671,
	763: 22.6418948,
	764: 22.70257508,
	765: 22.76341798,
	766: 22.82442394,
	767: 22.88559339,
	768: 22.94692678,
	769: 23.00842455,
	770: 23.07008712,
	771: 23.13191496,
	772: 23.19390849,
	773: 23.25606817,
	774: 23.31839443,
	775: 23.38088773,
	776: 23.4435485,
	777: 23.50637721,
	778: 23.56937431,
	779: 23.63254023,
	780: 23.69587544,
	781: 23.75938038,
	782: 23.82305552,
	783: 23.88690131,
	784: 23.95091821,
	785: 24.01510667,
	786: 24.07946715,
	787: 24.14400012,
	788: 24.20870604,
	789: 24.27358538,
	790: 24.33863859,
	791: 24.40386614,
	792: 24.4692685,
	793: 24.53484614,
	794: 24.60059953,
	795: 24.66652913,
	796: 24.73263543,
	797: 24.79891889,
	798: 24.86538,
	799: 24.93201921,
	800: 24.99883703,
	801: 25.06583391,
	802: 25.13301034,
	803: 25.20036681,
	804: 25.26790379,
	805: 25.33562178,
	806: 25.40352124,
	807: 25.47160268,
	808: 25.53986658,
	809: 25.60831342,
	810: 25.6769437,
	811: 25.74575791,
	812: 25.81475654,
	813: 25.88394009,
	814: 25.95330905,
	815: 26.02286391,
	816: 26.09260519,
	817: 26.16253337,
	818: 26.23264896,
	819: 26.30295246,
	820: 26.37344437,
	821: 26.4441252,
	822: 26.51499546,
	823: 26.58605565,
	824: 26.65730628,
	825: 26.72874786,
	826: 26.8003809,
	827: 26.87220592,
	828: 26.94422343,
	829: 27.01643395,
	830: 27.08883799,
	831: 27.16143608,
	832: 27.23422873,
	833: 27.30721646,
	834: 27.3803998,
	835: 27.45377927,
	836: 27.5273554,
	837: 27.60112871,
	838: 27.67509974,
	839: 27.74926901,
	840: 27.82363705,
	841: 27.8982044,
	842: 27.97297158,
	843: 28.04793915,
	844: 28.12310762,
	845: 28.19847755,
	846: 28.27404947,
	847: 28.34982392,
	848: 28.42580145,
	849: 28.5019826,
	850: 28.57836791,
	851: 28.65495794,
	852: 28.73175323,
	853: 28.80875433,
	854: 28.88596179,
	855: 28.96337617,
	856: 29.04099801,
	857: 29.11882789,
	858: 29.19686635,
	859: 29.27511395,
	860: 29.35357125,
	861: 29.43223882,
	862: 29.51111723,
	863: 29.59020702,
	864: 29.66950877,
	865: 29.74902306,
	866: 29.82875044,
	867: 29.90869149,
	868: 29.98884678,
	869: 30.06921689,
	870: 30.14980239,
	871: 30.23060386,
	872: 30.31162188,
	873: 30.39285703,
	874: 30.47430989,
	875: 30.55598104,
	876: 30.63787107,
	877: 30.71998056,
	878: 30.80231011,
	879: 30.8848603,
	880: 30.96763173,
	881: 31.05062498,
	882: 31.13384065,
	883: 31.21727935,
	884: 31.30094165,
	885: 31.38482818,
	886: 31.46893952,
	887: 31.55327628,
	888: 31.63783906,
	889: 31.72262847,
	890: 31.80764511,
	891: 31.8928896,
	892: 31.97836254,
	893: 32.06406455,
	894: 32.14999625,
	895: 32.23615824,
	896: 32.32255114,
	897: 32.40917558,
	898: 32.49603217,
	899: 32.58312153,
	900: 40.6704443,
	901: 40.77944109,
	902: 40.88872999,
	903: 40.99831179,
	904: 41.10818727,
	905: 41.21835721,
	906: 41.3288224,
	907: 41.43958365,
	908: 41.55064173,
	909: 41.66199745,
	910: 41.77365161,
	911: 41.88560499,
	912: 41.99785841,
	913: 42.11041267,
	914: 42.22326858,
	915: 42.33642694,
	916: 42.44988856,
	917: 42.56365427,
	918: 42.67772486,
	919: 42.79210116,
	920: 42.90678399,
	921: 43.02177417,
	922: 43.13707253,
	923: 43.25267988,
	924: 43.36859706,
	925: 43.4848249,
	926: 43.60136424,
	927: 43.71821589,
	928: 43.83538071,
	929: 43.95285953,
	930: 44.07065319,
	931: 44.18876254,
	932: 44.30718843,
	933: 44.42593169,
	934: 44.54499319,
	935: 44.66437377,
	936: 44.78407429,
	937: 44.90409561,
	938: 45.02443859,
	939: 45.14510408,
	940: 45.26609296,
	941: 45.38740609,
	942: 45.50904434,
	943: 45.63100858,
	944: 45.75329968,
	945: 45.87591853,
	946: 45.99886599,
	947: 46.12214295,
	948: 46.24575029,
	949: 46.3696889,
	950: 46.49395967,
	951: 46.61856348,
	952: 46.74350123,
	953: 46.86877381,
	954: 46.99438213,
	955: 47.12032707,
	956: 47.24660955,
	957: 47.37323046,
	958: 47.50019072,
	959: 47.62749123,
	960: 47.75513291,
	961: 47.88311666,
	962: 48.01144342,
	963: 48.14011408,
	964: 48.26912959,
	965: 48.39849086,
	966: 48.52819881,
	967: 48.65825439,
	968: 48.78865851,
	969: 48.91941211,
	970: 49.05051614,
	971: 49.18197152,
	972: 49.3137792,
	973: 49.44594013,
	974: 49.57845525,
	975: 49.71132551,
	976: 49.84455186,
	977: 49.97813526,
	978: 50.11207667,
	979: 50.24637703,
	980: 50.38103732,
	981: 50.5160585,
	982: 50.65144154,
	983: 50.7871874,
	984: 50.92329706,
	985: 51.0597715,
	986: 51.19661169,
	987: 51.33381861,
	988: 51.47139324,
	989: 51.60933657,
	990: 51.7476496,
	991: 51.8863333,
	992: 52.02538867,
	993: 52.16481671,
	994: 52.30461842,
	995: 52.4447948,
	996: 52.58534685,
	997: 52.72627558,
	998: 52.867582,
	999: 53.00926712,
	1e3: 53.15133195,
	1001: 53.29377752,
	1002: 53.43660485,
	1003: 53.57981495,
	1004: 53.72340885,
	1005: 53.86738759,
	1006: 54.01175219,
	1007: 54.15650368,
	1008: 54.30164311,
	1009: 54.44717151,
	1010: 54.59308993,
	1011: 54.73939942,
	1012: 54.88610101,
	1013: 55.03319576,
	1014: 55.18068472,
	1015: 55.32856896,
	1016: 55.47684952,
	1017: 55.62552748,
	1018: 55.77460389,
	1019: 55.92407983,
	1020: 56.07395636,
	1021: 56.22423457,
	1022: 56.37491552,
	1023: 56.52600029,
	1024: 56.67748997,
	1025: 56.82938564,
	1026: 56.9816884,
	1027: 57.13439932,
	1028: 57.28751951,
	1029: 57.44105006,
	1030: 57.59499208,
	1031: 57.74934666,
	1032: 57.90411491,
	1033: 58.05929793,
	1034: 58.21489685,
	1035: 58.37091278,
	1036: 58.52734682,
	1037: 58.68420011,
	1038: 58.84147377,
	1039: 58.99916892,
	1040: 59.15728669,
	1041: 59.31582822,
	1042: 59.47479464,
	1043: 59.63418709,
	1044: 59.79400671,
	1045: 59.95425465,
	1046: 60.11493205,
	1047: 60.27604007,
	1048: 60.43757985,
	1049: 60.59955257,
	1050: 60.76195937,
	1051: 60.92480142,
	1052: 61.08807989,
	1053: 61.25179594,
	1054: 61.41595076,
	1055: 61.5805455,
	1056: 61.74558137,
	1057: 61.91105952,
	1058: 62.07698116,
	1059: 62.24334747,
	1060: 62.41015964,
	1061: 62.57741887,
	1062: 62.74512635,
	1063: 62.91328329,
	1064: 63.08189089,
	1065: 63.25095036,
	1066: 63.42046291,
	1067: 63.59042975,
	1068: 63.7608521,
	1069: 63.93173118,
	1070: 64.10306822,
	1071: 64.27486445,
	1072: 64.44712108,
	1073: 64.61983937,
	1074: 64.79302054,
	1075: 64.96666583,
	1076: 65.1407765,
	1077: 65.31535378,
	1078: 65.49039892,
	1079: 65.66591319,
	1080: 81.84189784,
	1081: 82.06123413,
	1082: 82.28115823,
	1083: 82.50167174,
	1084: 82.72277622,
	1085: 82.94447326,
	1086: 83.16676445,
	1087: 83.38965138,
	1088: 83.61313564,
	1089: 83.83721885,
	1090: 84.06190259,
	1091: 84.28718849,
	1092: 84.51307816,
	1093: 84.73957321,
	1094: 84.96667526,
	1095: 85.19438595,
};
const promptSupply = 1e9;
const stakingRewards = promptSupply * 0.4;

const formatNumberWithCommas = (num: number) =>
	num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function getModifierForDays(days: number) {
	return modifierByDays[days] || 1;
}

function calculatePoints(deposit: Deposit): number {
	const amountPoints = parseFloat(deposit.amount);
	const { createdTimestamp, endTimestamp, updatedTimestamp } = deposit;
	if (!updatedTimestamp) {
		const durationInDays = (endTimestamp - createdTimestamp) / (60 * 60 * 24);
		const modifier = getModifierForDays(
			Math.min(Math.floor(durationInDays), 1095)
		);
		return amountPoints * modifier;
	}

	const initialDurationInDays =
		(updatedTimestamp - createdTimestamp) / (60 * 60 * 24);
	const newDurationInDays = (endTimestamp - createdTimestamp) / (60 * 60 * 24);
	const initialPoints =
		amountPoints * getModifierForDays(initialDurationInDays);
	const newPoints = amountPoints * getModifierForDays(newDurationInDays);

	return initialPoints + newPoints;
}

function calculateTotalPoints(deposits: Deposit[]): number {
	return deposits.reduce((total, deposit) => total + deposit.points, 0);
}

function sortUserDeposits(userDeposits: UserDeposits) {
	return Object.entries(userDeposits).sort((a, b) => {
		const totalA = calculateTotalPoints(a[1]);
		const totalB = calculateTotalPoints(b[1]);
		return totalB - totalA;
	});
}

const fetchPrimeValue = async () => {
	try {
		const response = await fetch(
			"https://api.coinbase.com/v2/exchange-rates?currency=PRIME"
		);
		const data = await response.json();
		return parseFloat(data.data.rates.USD).toFixed(2);
	} catch (err: any) {
		console.error(err);
		return "";
	}
};

const isLocalStorageIsOutdated = (key: string) => {
	const savedData = localStorage.getItem(key);
	if (savedData) {
		const parsedData: LocalStorageData = JSON.parse(savedData);
		const now = Date.now();
		if (now - parsedData.timestamp < 60 * 1000) {
			return false;
		}
	}
	return true;
};

import { startOfDay, addDays, format } from "date-fns";

const calculateDailySnapshots = (deposits: Deposit[]): DailySnapshot[] => {
	// Create a map to store daily points
	const dailyPointsMap: { [key: string]: number } = {};

	deposits.forEach((deposit) => {
		const startDate = startOfDay(new Date(deposit.createdTimestamp));
		const endDate = startOfDay(new Date(deposit.endTimestamp));

		for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
			const dateString = format(date, "yyyy-MM-dd");
			if (dailyPointsMap[dateString]) {
				dailyPointsMap[dateString] += deposit.points;
			} else {
				dailyPointsMap[dateString] = deposit.points;
			}
		}
	});

	// Convert map to array of snapshots
	return Object.keys(dailyPointsMap).map((date) => ({
		date,
		totalPoints: dailyPointsMap[date],
	}));
};

const getApiUrl = (endpoint: string) => {
	const apiUrl = process.env.NEXT_PUBLIC_ADDRESSES_API_URL + endpoint;
	if (!apiUrl) {
		throw new Error("NEXT_PUBLIC_ADDRESSES_API_URL is not defined");
	}
	return apiUrl;
};

export {
	calculateDailySnapshots,
	calculatePoints,
	calculateTotalPoints,
	fetchPrimeValue,
	formatNumberWithCommas,
	getApiUrl,
	getModifierForDays,
	isLocalStorageIsOutdated,
	promptSupply,
	sortUserDeposits,
	stakingRewards,
};
