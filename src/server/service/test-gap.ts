import { referenceDelta } from "#service/gap.service.ts";
import {initReferenceInterval} from "#service/reference-lap.service.ts";

const debug = {
  "aheadIdx": 4,
  "behindIdx": 0,
  "aheadPct": 0.43631571531295776,
  "behindPct": 0.43234583735466003,
  "refLap": {
    "startTime": 108.25000076293632,
    "finishTime": 240.71666742969157,
    "refPoints": {},
    "lastTrackedPct": 0.9998138546943665,
    "isCleanLap": true
  },
  "refPoints": {
    "0": {
      "trackPct": 0.0000010346818726247875,
      "timeElapsedSinceStart": 0
    },
    "0.00051779": {
      "timeElapsedSinceStart": 0.38333333333331154,
      "trackPct": 0.0005736883031204343
    },
    "0.00103559": {
      "timeElapsedSinceStart": 0.6999999999999602,
      "trackPct": 0.001119665103033185
    },
    "0.00155338": {
      "timeElapsedSinceStart": 0.9333333333332803,
      "trackPct": 0.0015699057839810848
    },
    "0.00207118": {
      "timeElapsedSinceStart": 1.2166666666665975,
      "trackPct": 0.002177539048716426
    },
    "0.00258897": {
      "timeElapsedSinceStart": 1.3999999999999204,
      "trackPct": 0.002609963994473219
    },
    "0.00310677": {
      "timeElapsedSinceStart": 1.6333333333332405,
      "trackPct": 0.0032103664707392454
    },
    "0.00362456": {
      "timeElapsedSinceStart": 1.8166666666665634,
      "trackPct": 0.00372471590526402
    },
    "0.00414236": {
      "timeElapsedSinceStart": 1.9666666666665549,
      "trackPct": 0.004174842964857817
    },
    "0.00466015": {
      "timeElapsedSinceStart": 2.149999999999878,
      "trackPct": 0.004762166179716587
    },
    "0.00517795": {
      "timeElapsedSinceStart": 2.2833333333332035,
      "trackPct": 0.005215468350797892
    },
    "0.00569574": {
      "timeElapsedSinceStart": 2.433333333333195,
      "trackPct": 0.0057518635876476765
    },
    "0.00621354": {
      "timeElapsedSinceStart": 2.5666666666665208,
      "trackPct": 0.006252450402826071
    },
    "0.00673133": {
      "timeElapsedSinceStart": 2.6999999999998465,
      "trackPct": 0.006775106769055128
    },
    "0.00724913": {
      "timeElapsedSinceStart": 2.849999999999838,
      "trackPct": 0.00739006232470274
    },
    "0.00776692": {
      "timeElapsedSinceStart": 2.9833333333331638,
      "trackPct": 0.00795999076217413
    },
    "0.00828472": {
      "timeElapsedSinceStart": 3.083333333333158,
      "trackPct": 0.008402234874665737
    },
    "0.00880251": {
      "timeElapsedSinceStart": 3.216666666666484,
      "trackPct": 0.009010670706629753
    },
    "0.00932031": {
      "timeElapsedSinceStart": 3.316666666666478,
      "trackPct": 0.009480672888457775
    },
    "0.0098381": {
      "timeElapsedSinceStart": 3.3999999999998067,
      "trackPct": 0.009881778620183468
    },
    "0.0103559": {
      "timeElapsedSinceStart": 3.499999999999801,
      "trackPct": 0.010374068282544613
    },
    "0.01087369": {
      "timeElapsedSinceStart": 3.5999999999997954,
      "trackPct": 0.01087789423763752
    },
    "0.01139149": {
      "timeElapsedSinceStart": 3.733333333333121,
      "trackPct": 0.011568265035748482
    },
    "0.01190928": {
      "timeElapsedSinceStart": 3.8333333333331154,
      "trackPct": 0.01209954172372818
    },
    "0.01242708": {
      "timeElapsedSinceStart": 3.916666666666444,
      "trackPct": 0.012550834566354752
    },
    "0.01294487": {
      "timeElapsedSinceStart": 4.016666666666438,
      "trackPct": 0.013102876953780651
    },
    "0.01346267": {
      "timeElapsedSinceStart": 4.099999999999767,
      "trackPct": 0.013571212999522686
    },
    "0.01398046": {
      "timeElapsedSinceStart": 4.199999999999761,
      "trackPct": 0.01414389256387949
    },
    "0.01449826": {
      "timeElapsedSinceStart": 4.299999999999756,
      "trackPct": 0.014727375470101833
    },
    "0.01501605": {
      "timeElapsedSinceStart": 4.383333333333084,
      "trackPct": 0.01522169541567564
    },
    "0.01553385": {
      "timeElapsedSinceStart": 4.4833333333330785,
      "trackPct": 0.015824533998966217
    },
    "0.01605164": {
      "timeElapsedSinceStart": 4.533333333333076,
      "trackPct": 0.016129516065120697
    },
    "0.01656944": {
      "timeElapsedSinceStart": 4.616666666666404,
      "trackPct": 0.016643855720758438
    },
    "0.01708723": {
      "timeElapsedSinceStart": 4.7166666666663986,
      "trackPct": 0.017270248383283615
    },
    "0.01760503": {
      "timeElapsedSinceStart": 4.799999999999727,
      "trackPct": 0.017799723893404007
    },
    "0.01812282": {
      "timeElapsedSinceStart": 4.8999999999997215,
      "trackPct": 0.018443772569298744
    },
    "0.01864062": {
      "timeElapsedSinceStart": 4.949999999999719,
      "trackPct": 0.01876712404191494
    },
    "0.01915841": {
      "timeElapsedSinceStart": 5.033333333333047,
      "trackPct": 0.01931062340736389
    },
    "0.01967621": {
      "timeElapsedSinceStart": 5.1333333333330415,
      "trackPct": 0.019970981404185295
    },
    "0.020194": {
      "timeElapsedSinceStart": 5.183333333333039,
      "trackPct": 0.02030443400144577
    },
    "0.0207118": {
      "timeElapsedSinceStart": 5.266666666666367,
      "trackPct": 0.02086479589343071
    },
    "0.02122959": {
      "timeElapsedSinceStart": 5.366666666666362,
      "trackPct": 0.021545149385929108
    },
    "0.02174739": {
      "timeElapsedSinceStart": 5.416666666666359,
      "trackPct": 0.021888550370931625
    },
    "0.02226518": {
      "timeElapsedSinceStart": 5.499999999999687,
      "trackPct": 0.022465398535132408
    },
    "0.02278297": {
      "timeElapsedSinceStart": 5.5499999999996845,
      "trackPct": 0.022814176976680756
    },
    "0.02330077": {
      "timeElapsedSinceStart": 5.649999999999679,
      "trackPct": 0.02351740375161171
    },
    "0.02381856": {
      "timeElapsedSinceStart": 5.733333333333007,
      "trackPct": 0.024109652265906334
    },
    "0.02433636": {
      "timeElapsedSinceStart": 5.783333333333005,
      "trackPct": 0.024467624723911285
    },
    "0.02485415": {
      "timeElapsedSinceStart": 5.883333333332999,
      "trackPct": 0.025189686566591263
    },
    "0.02537195": {
      "timeElapsedSinceStart": 5.91666666666633,
      "trackPct": 0.025432150810956955
    },
    "0.02588974": {
      "timeElapsedSinceStart": 6.016666666666325,
      "trackPct": 0.026164596900343895
    },
    "0.02640754": {
      "timeElapsedSinceStart": 6.066666666666322,
      "trackPct": 0.026533734053373337
    },
    "0.02692533": {
      "timeElapsedSinceStart": 6.14999999999965,
      "trackPct": 0.027152976021170616
    },
    "0.02744313": {
      "timeElapsedSinceStart": 6.199999999999648,
      "trackPct": 0.027527272701263428
    },
    "0.02796092": {
      "timeElapsedSinceStart": 6.299999999999642,
      "trackPct": 0.02828114852309227
    },
    "0.02847872": {
      "timeElapsedSinceStart": 6.349999999999639,
      "trackPct": 0.028660848736763
    },
    "0.02899651": {
      "timeElapsedSinceStart": 6.433333333332968,
      "trackPct": 0.029297571629285812
    },
    "0.02951431": {
      "timeElapsedSinceStart": 6.483333333332965,
      "trackPct": 0.0296819806098938
    },
    "0.0300321": {
      "timeElapsedSinceStart": 6.533333333332962,
      "trackPct": 0.030068203806877136
    },
    "0.0305499": {
      "timeElapsedSinceStart": 6.6166666666662906,
      "trackPct": 0.030715616419911385
    },
    "0.03106769": {
      "timeElapsedSinceStart": 6.666666666666288,
      "trackPct": 0.031106438487768173
    },
    "0.03158549": {
      "timeElapsedSinceStart": 6.766666666666282,
      "trackPct": 0.031892985105514526
    },
    "0.03210328": {
      "timeElapsedSinceStart": 6.7999999999996135,
      "trackPct": 0.032156527042388916
    },
    "0.03262108": {
      "timeElapsedSinceStart": 6.899999999999608,
      "trackPct": 0.03295205906033516
    },
    "0.03313887": {
      "timeElapsedSinceStart": 6.949999999999605,
      "trackPct": 0.03335246816277504
    },
    "0.03365667": {
      "timeElapsedSinceStart": 6.999999999999602,
      "trackPct": 0.033754654228687286
    },
    "0.03417446": {
      "timeElapsedSinceStart": 7.083333333332931,
      "trackPct": 0.03442870080471039
    },
    "0.03469226": {
      "timeElapsedSinceStart": 7.133333333332928,
      "trackPct": 0.034835319966077805
    },
    "0.03521005": {
      "timeElapsedSinceStart": 7.183333333332925,
      "trackPct": 0.03524363040924072
    },
    "0.03572785": {
      "timeElapsedSinceStart": 7.283333333332919,
      "trackPct": 0.0360654778778553
    },
    "0.03624564": {
      "timeElapsedSinceStart": 7.316666666666251,
      "trackPct": 0.03634082153439522
    },
    "0.03676344": {
      "timeElapsedSinceStart": 7.416666666666245,
      "trackPct": 0.037171460688114166
    },
    "0.03728123": {
      "timeElapsedSinceStart": 7.466666666666242,
      "trackPct": 0.03758928179740906
    },
    "0.03779903": {
      "timeElapsedSinceStart": 7.499999999999574,
      "trackPct": 0.0378686748445034
    },
    "0.03831682": {
      "timeElapsedSinceStart": 7.599999999999568,
      "trackPct": 0.038711197674274445
    },
    "0.03883462": {
      "timeElapsedSinceStart": 7.649999999999565,
      "trackPct": 0.03913485258817673
    },
    "0.03935241": {
      "timeElapsedSinceStart": 7.699999999999562,
      "trackPct": 0.039560116827487946
    },
    "0.03987021": {
      "timeElapsedSinceStart": 7.783333333332891,
      "trackPct": 0.04027237743139267
    },
    "0.040388": {
      "timeElapsedSinceStart": 7.833333333332888,
      "trackPct": 0.040701836347579956
    },
    "0.0409058": {
      "timeElapsedSinceStart": 7.883333333332885,
      "trackPct": 0.04113281890749931
    },
    "0.04142359": {
      "timeElapsedSinceStart": 7.933333333332882,
      "trackPct": 0.04156499356031418
    },
    "0.04194139": {
      "timeElapsedSinceStart": 8.016666666666211,
      "trackPct": 0.04228635132312775
    },
    "0.04245918": {
      "timeElapsedSinceStart": 8.066666666666208,
      "trackPct": 0.04272129759192467
    },
    "0.04297698": {
      "timeElapsedSinceStart": 8.116666666666205,
      "trackPct": 0.04315740242600441
    },
    "0.04349477": {
      "timeElapsedSinceStart": 8.166666666666202,
      "trackPct": 0.04359440878033638
    },
    "0.04401257": {
      "timeElapsedSinceStart": 8.249999999999531,
      "trackPct": 0.044324807822704315
    },
    "0.04453036": {
      "timeElapsedSinceStart": 8.299999999999528,
      "trackPct": 0.0447651669383049
    },
    "0.04504815": {
      "timeElapsedSinceStart": 8.349999999999525,
      "trackPct": 0.04520710930228233
    },
    "0.04556595": {
      "timeElapsedSinceStart": 8.399999999999523,
      "trackPct": 0.04565068706870079
    },
    "0.04608374": {
      "timeElapsedSinceStart": 8.483333333332851,
      "trackPct": 0.046393584460020065
    },
    "0.04660154": {
      "timeElapsedSinceStart": 8.533333333332848,
      "trackPct": 0.04684148356318474
    },
    "0.04711933": {
      "timeElapsedSinceStart": 8.583333333332845,
      "trackPct": 0.04729100689291954
    },
    "0.04763713": {
      "timeElapsedSinceStart": 8.633333333332843,
      "trackPct": 0.047742102295160294
    },
    "0.04815492": {
      "timeElapsedSinceStart": 8.68333333333284,
      "trackPct": 0.04819479584693909
    },
    "0.04867272": {
      "timeElapsedSinceStart": 8.766666666666168,
      "trackPct": 0.04895301163196564
    },
    "0.04919051": {
      "timeElapsedSinceStart": 8.816666666666165,
      "trackPct": 0.04941009357571602
    },
    "0.04970831": {
      "timeElapsedSinceStart": 8.866666666666163,
      "trackPct": 0.04986876621842384
    },
    "0.0502261": {
      "timeElapsedSinceStart": 8.91666666666616,
      "trackPct": 0.050329022109508514
    },
    "0.0507439": {
      "timeElapsedSinceStart": 8.999999999999488,
      "trackPct": 0.05109960958361626
    },
    "0.05126169": {
      "timeElapsedSinceStart": 9.049999999999486,
      "trackPct": 0.05156411975622177
    },
    "0.05177949": {
      "timeElapsedSinceStart": 9.099999999999483,
      "trackPct": 0.052030179649591446
    },
    "0.05229728": {
      "timeElapsedSinceStart": 9.133333333332814,
      "trackPct": 0.05234171822667122
    },
    "0.05281508": {
      "timeElapsedSinceStart": 9.233333333332808,
      "trackPct": 0.053280409425497055
    },
    "0.05333287": {
      "timeElapsedSinceStart": 9.283333333332806,
      "trackPct": 0.05375201255083084
    },
    "0.05385067": {
      "timeElapsedSinceStart": 9.333333333332803,
      "trackPct": 0.05422505363821983
    },
    "0.05436846": {
      "timeElapsedSinceStart": 9.366666666666134,
      "trackPct": 0.054541170597076416
    },
    "0.05488626": {
      "timeElapsedSinceStart": 9.416666666666131,
      "trackPct": 0.05501648783683777
    },
    "0.05540405": {
      "timeElapsedSinceStart": 9.466666666666129,
      "trackPct": 0.0554930604994297
    },
    "0.05592185": {
      "timeElapsedSinceStart": 9.516666666666126,
      "trackPct": 0.05597095564007759
    },
    "0.05643964": {
      "timeElapsedSinceStart": 9.566666666666123,
      "trackPct": 0.0564495213329792
    },
    "0.05695744": {
      "timeElapsedSinceStart": 9.649999999999451,
      "trackPct": 0.057247139513492584
    },
    "0.05747523": {
      "timeElapsedSinceStart": 9.699999999999449,
      "trackPct": 0.05772421509027481
    },
    "0.05799303": {
      "timeElapsedSinceStart": 9.749999999999446,
      "trackPct": 0.05819972977042198
    },
    "0.05851082": {
      "timeElapsedSinceStart": 9.799999999999443,
      "trackPct": 0.05867292359471321
    },
    "0.05902862": {
      "timeElapsedSinceStart": 9.883333333332772,
      "trackPct": 0.05945644527673721
    },
    "0.05954641": {
      "timeElapsedSinceStart": 9.933333333332769,
      "trackPct": 0.05992322415113449
    },
    "0.06006421": {
      "timeElapsedSinceStart": 9.983333333332766,
      "trackPct": 0.06038736552000046
    },
    "0.060582": {
      "timeElapsedSinceStart": 10.033333333332763,
      "trackPct": 0.06084849312901497
    },
    "0.0610998": {
      "timeElapsedSinceStart": 10.08333333333276,
      "trackPct": 0.061306487768888474
    },
    "0.06161759": {
      "timeElapsedSinceStart": 10.166666666666089,
      "trackPct": 0.06206238642334938
    },
    "0.06213539": {
      "timeElapsedSinceStart": 10.216666666666086,
      "trackPct": 0.06251122802495956
    },
    "0.06265318": {
      "timeElapsedSinceStart": 10.266666666666083,
      "trackPct": 0.06295636296272278
    },
    "0.06317098": {
      "timeElapsedSinceStart": 10.299999999999415,
      "trackPct": 0.06325127184391022
    },
    "0.06368877": {
      "timeElapsedSinceStart": 10.349999999999412,
      "trackPct": 0.06369142234325409
    },
    "0.06420657": {
      "timeElapsedSinceStart": 10.449999999999406,
      "trackPct": 0.06456421315670013
    },
    "0.06472436": {
      "timeElapsedSinceStart": 10.499999999999403,
      "trackPct": 0.0649939626455307
    },
    "0.06524216": {
      "timeElapsedSinceStart": 10.533333333332735,
      "trackPct": 0.06527802348136902
    },
    "0.06575995": {
      "timeElapsedSinceStart": 10.633333333332729,
      "trackPct": 0.06611903756856918
    },
    "0.06627775": {
      "timeElapsedSinceStart": 10.683333333332726,
      "trackPct": 0.06653369963169098
    },
    "0.06679554": {
      "timeElapsedSinceStart": 10.733333333332723,
      "trackPct": 0.06694470345973969
    },
    "0.06731333": {
      "timeElapsedSinceStart": 10.816666666666052,
      "trackPct": 0.06761904060840607
    },
    "0.06783113": {
      "timeElapsedSinceStart": 10.866666666666049,
      "trackPct": 0.06801766902208328
    },
    "0.06834892": {
      "timeElapsedSinceStart": 10.916666666666046,
      "trackPct": 0.0684119313955307
    },
    "0.06886672": {
      "timeElapsedSinceStart": 10.999999999999375,
      "trackPct": 0.06905948370695114
    },
    "0.06938451": {
      "timeElapsedSinceStart": 11.049999999999372,
      "trackPct": 0.06944248080253601
    },
    "0.06990231": {
      "timeElapsedSinceStart": 11.149999999999366,
      "trackPct": 0.07019607722759247
    },
    "0.0704201": {
      "timeElapsedSinceStart": 11.199999999999363,
      "trackPct": 0.07056713849306107
    },
    "0.0709379": {
      "timeElapsedSinceStart": 11.283333333332692,
      "trackPct": 0.0711774230003357
    },
    "0.07145569": {
      "timeElapsedSinceStart": 11.333333333332689,
      "trackPct": 0.07153972238302231
    },
    "0.07197349": {
      "timeElapsedSinceStart": 11.433333333332683,
      "trackPct": 0.07226034253835678
    },
    "0.07249128": {
      "timeElapsedSinceStart": 11.466666666666015,
      "trackPct": 0.07249867171049118
    },
    "0.07300908": {
      "timeElapsedSinceStart": 11.56666666666601,
      "trackPct": 0.07320821285247803
    },
    "0.07352687": {
      "timeElapsedSinceStart": 11.616666666666006,
      "trackPct": 0.07356072217226028
    },
    "0.07404467": {
      "timeElapsedSinceStart": 11.699999999999335,
      "trackPct": 0.07414592802524567
    },
    "0.07456246": {
      "timeElapsedSinceStart": 11.79999999999933,
      "trackPct": 0.07484754174947739
    },
    "0.07508026": {
      "timeElapsedSinceStart": 11.849999999999326,
      "trackPct": 0.07519835978746414
    },
    "0.07559805": {
      "timeElapsedSinceStart": 11.933333333332655,
      "trackPct": 0.07578324526548386
    },
    "0.07611585": {
      "timeElapsedSinceStart": 11.983333333332652,
      "trackPct": 0.0761343315243721
    },
    "0.07663364": {
      "timeElapsedSinceStart": 12.083333333332646,
      "trackPct": 0.07683678716421127
    },
    "0.07715144": {
      "timeElapsedSinceStart": 12.166666666665975,
      "trackPct": 0.077422134578228
    },
    "0.07766923": {
      "timeElapsedSinceStart": 12.216666666665972,
      "trackPct": 0.07777337729930878
    },
    "0.07818703": {
      "timeElapsedSinceStart": 12.316666666665967,
      "trackPct": 0.07847628742456436
    },
    "0.07870482": {
      "timeElapsedSinceStart": 12.349999999999298,
      "trackPct": 0.07871058583259583
    },
    "0.07922262": {
      "timeElapsedSinceStart": 12.449999999999292,
      "trackPct": 0.0794135332107544
    },
    "0.07974041": {
      "timeElapsedSinceStart": 12.49999999999929,
      "trackPct": 0.07976429909467697
    },
    "0.08025821": {
      "timeElapsedSinceStart": 12.583333333332618,
      "trackPct": 0.08034747838973999
    },
    "0.080776": {
      "timeElapsedSinceStart": 12.683333333332612,
      "trackPct": 0.08104480057954788
    },
    "0.0812938": {
      "timeElapsedSinceStart": 12.73333333333261,
      "trackPct": 0.08139259368181229
    },
    "0.08181159": {
      "timeElapsedSinceStart": 12.816666666665938,
      "trackPct": 0.08197076618671417
    },
    "0.08232939": {
      "timeElapsedSinceStart": 12.916666666665932,
      "trackPct": 0.0826621949672699
    },
    "0.08284718": {
      "timeElapsedSinceStart": 12.96666666666593,
      "trackPct": 0.08300714194774628
    },
    "0.08336498": {
      "timeElapsedSinceStart": 13.049999999999258,
      "trackPct": 0.08358108997344971
    },
    "0.08388277": {
      "timeElapsedSinceStart": 13.099999999999255,
      "trackPct": 0.08392493426799774
    },
    "0.08440057": {
      "timeElapsedSinceStart": 13.19999999999925,
      "trackPct": 0.08461173623800278
    },
    "0.08491836": {
      "timeElapsedSinceStart": 13.283333333332578,
      "trackPct": 0.08518321812152863
    },
    "0.08543616": {
      "timeElapsedSinceStart": 13.333333333332575,
      "trackPct": 0.08552572876214981
    },
    "0.08595395": {
      "timeElapsedSinceStart": 13.43333333333257,
      "trackPct": 0.08621006458997726
    },
    "0.08647175": {
      "timeElapsedSinceStart": 13.516666666665898,
      "trackPct": 0.08677934110164642
    },
    "0.08698954": {
      "timeElapsedSinceStart": 13.566666666665895,
      "trackPct": 0.08712013810873032
    },
    "0.08750734": {
      "timeElapsedSinceStart": 13.66666666666589,
      "trackPct": 0.08779928088188171
    },
    "0.08802513": {
      "timeElapsedSinceStart": 13.699999999999221,
      "trackPct": 0.08802518248558044
    },
    "0.08854293": {
      "timeElapsedSinceStart": 13.799999999999216,
      "trackPct": 0.0887012630701065
    },
    "0.08906072": {
      "timeElapsedSinceStart": 13.89999999999921,
      "trackPct": 0.0893760621547699
    },
    "0.08957851": {
      "timeElapsedSinceStart": 13.933333333332541,
      "trackPct": 0.08960086107254028
    },
    "0.09009631": {
      "timeElapsedSinceStart": 14.033333333332536,
      "trackPct": 0.0902751013636589
    },
    "0.0906141": {
      "timeElapsedSinceStart": 14.13333333333253,
      "trackPct": 0.09095094352960587
    },
    "0.0911319": {
      "timeElapsedSinceStart": 14.166666666665861,
      "trackPct": 0.09117674082517624
    },
    "0.09164969": {
      "timeElapsedSinceStart": 14.266666666665856,
      "trackPct": 0.0918559730052948
    },
    "0.09216749": {
      "timeElapsedSinceStart": 14.316666666665853,
      "trackPct": 0.09219669550657272
    },
    "0.09268528": {
      "timeElapsedSinceStart": 14.399999999999181,
      "trackPct": 0.09276685118675232
    },
    "0.09320308": {
      "timeElapsedSinceStart": 14.499999999999176,
      "trackPct": 0.09345577657222748
    },
    "0.09372087": {
      "timeElapsedSinceStart": 14.549999999999173,
      "trackPct": 0.09380228817462921
    },
    "0.09423867": {
      "timeElapsedSinceStart": 14.633333333332502,
      "trackPct": 0.09438195824623108
    },
    "0.09475646": {
      "timeElapsedSinceStart": 14.733333333332496,
      "trackPct": 0.09508006274700165
    },
    "0.09527426": {
      "timeElapsedSinceStart": 14.783333333332493,
      "trackPct": 0.0954304039478302
    },
    "0.09579205": {
      "timeElapsedSinceStart": 14.866666666665822,
      "trackPct": 0.09601642936468124
    },
    "0.09630985": {
      "timeElapsedSinceStart": 14.916666666665819,
      "trackPct": 0.09636957198381424
    },
    "0.09682764": {
      "timeElapsedSinceStart": 15.016666666665813,
      "trackPct": 0.09707973897457123
    },
    "0.09734544": {
      "timeElapsedSinceStart": 15.06666666666581,
      "trackPct": 0.09743691235780716
    },
    "0.09786323": {
      "timeElapsedSinceStart": 15.149999999999139,
      "trackPct": 0.09803569316864014
    },
    "0.09838103": {
      "timeElapsedSinceStart": 15.199999999999136,
      "trackPct": 0.0983973890542984
    },
    "0.09889882": {
      "timeElapsedSinceStart": 15.283333333332465,
      "trackPct": 0.099004827439785
    },
    "0.09941662": {
      "timeElapsedSinceStart": 15.383333333332459,
      "trackPct": 0.09974226355552673
    },
    "0.09993441": {
      "timeElapsedSinceStart": 15.433333333332456,
      "trackPct": 0.10011487454175949
    },
    "0.10045221": {
      "timeElapsedSinceStart": 15.483333333332453,
      "trackPct": 0.10049030184745789
    },
    "0.10097": {
      "timeElapsedSinceStart": 15.566666666665782,
      "trackPct": 0.10112214833498001
    },
    "0.1014878": {
      "timeElapsedSinceStart": 15.616666666665779,
      "trackPct": 0.10150488466024399
    },
    "0.10200559": {
      "timeElapsedSinceStart": 15.716666666665773,
      "trackPct": 0.10227422416210175
    },
    "0.10252339": {
      "timeElapsedSinceStart": 15.749999999999105,
      "trackPct": 0.10253240913152695
    },
    "0.10304118": {
      "timeElapsedSinceStart": 15.849999999999099,
      "trackPct": 0.10331135988235474
    },
    "0.10355898": {
      "timeElapsedSinceStart": 15.899999999999096,
      "trackPct": 0.10370348393917084
    },
    "0.10407677": {
      "timeElapsedSinceStart": 15.949999999999093,
      "trackPct": 0.10409726202487946
    },
    "0.10459457": {
      "timeElapsedSinceStart": 16.033333333332422,
      "trackPct": 0.10475677996873856
    },
    "0.10511236": {
      "timeElapsedSinceStart": 16.08333333333242,
      "trackPct": 0.10515471547842026
    },
    "0.10563016": {
      "timeElapsedSinceStart": 16.183333333332413,
      "trackPct": 0.10595478862524033
    },
    "0.10614795": {
      "timeElapsedSinceStart": 16.216666666665745,
      "trackPct": 0.10622280091047287
    },
    "0.10666575": {
      "timeElapsedSinceStart": 16.31666666666574,
      "trackPct": 0.10703084617853165
    },
    "0.10718354": {
      "timeElapsedSinceStart": 16.366666666665736,
      "trackPct": 0.10743622481822968
    },
    "0.10770134": {
      "timeElapsedSinceStart": 16.416666666665733,
      "trackPct": 0.1078428253531456
    },
    "0.10821913": {
      "timeElapsedSinceStart": 16.499999999999062,
      "trackPct": 0.10852432250976562
    },
    "0.10873693": {
      "timeElapsedSinceStart": 16.54999999999906,
      "trackPct": 0.10893526673316956
    },
    "0.10925472": {
      "timeElapsedSinceStart": 16.599999999999056,
      "trackPct": 0.10934800654649734
    },
    "0.10977252": {
      "timeElapsedSinceStart": 16.683333333332385,
      "trackPct": 0.11003889888525009
    },
    "0.11029031": {
      "timeElapsedSinceStart": 16.733333333332382,
      "trackPct": 0.11045513302087784
    },
    "0.11080811": {
      "timeElapsedSinceStart": 16.78333333333238,
      "trackPct": 0.11087272316217422
    },
    "0.1113259": {
      "timeElapsedSinceStart": 16.883333333332374,
      "trackPct": 0.11171195656061172
    },
    "0.11184369": {
      "timeElapsedSinceStart": 16.916666666665705,
      "trackPct": 0.11199286580085754
    },
    "0.11236149": {
      "timeElapsedSinceStart": 16.966666666665702,
      "trackPct": 0.11241534352302551
    },
    "0.11287928": {
      "timeElapsedSinceStart": 17.066666666665697,
      "trackPct": 0.11326400935649872
    },
    "0.11339708": {
      "timeElapsedSinceStart": 17.116666666665694,
      "trackPct": 0.11369020491838455
    },
    "0.11391487": {
      "timeElapsedSinceStart": 17.149999999999025,
      "trackPct": 0.11397506296634674
    },
    "0.11443267": {
      "timeElapsedSinceStart": 17.24999999999902,
      "trackPct": 0.11483269184827805
    },
    "0.11495046": {
      "timeElapsedSinceStart": 17.299999999999017,
      "trackPct": 0.11526322364807129
    },
    "0.11546826": {
      "timeElapsedSinceStart": 17.349999999999014,
      "trackPct": 0.11569491773843765
    },
    "0.11598605": {
      "timeElapsedSinceStart": 17.433333333332342,
      "trackPct": 0.11641700565814972
    },
    "0.11650385": {
      "timeElapsedSinceStart": 17.48333333333234,
      "trackPct": 0.11685175448656082
    },
    "0.11702164": {
      "timeElapsedSinceStart": 17.533333333332337,
      "trackPct": 0.11728764325380325
    },
    "0.11753944": {
      "timeElapsedSinceStart": 17.583333333332334,
      "trackPct": 0.11772474646568298
    },
    "0.11805723": {
      "timeElapsedSinceStart": 17.666666666665662,
      "trackPct": 0.11845630407333374
    },
    "0.11857503": {
      "timeElapsedSinceStart": 17.71666666666566,
      "trackPct": 0.11889707297086716
    },
    "0.11909282": {
      "timeElapsedSinceStart": 17.766666666665657,
      "trackPct": 0.11933910101652145
    },
    "0.11961062": {
      "timeElapsedSinceStart": 17.799999999998988,
      "trackPct": 0.11963450163602829
    },
    "0.12012841": {
      "timeElapsedSinceStart": 17.899999999998983,
      "trackPct": 0.12052159011363983
    },
    "0.12064621": {
      "timeElapsedSinceStart": 17.94999999999898,
      "trackPct": 0.12096685916185379
    },
    "0.121164": {
      "timeElapsedSinceStart": 17.999999999998977,
      "trackPct": 0.12141329795122147
    },
    "0.1216818": {
      "timeElapsedSinceStart": 18.03333333333231,
      "trackPct": 0.12171169370412827
    },
    "0.12219959": {
      "timeElapsedSinceStart": 18.133333333332303,
      "trackPct": 0.12261020392179489
    },
    "0.12271739": {
      "timeElapsedSinceStart": 18.1833333333323,
      "trackPct": 0.12306133657693863
    },
    "0.12323518": {
      "timeElapsedSinceStart": 18.233333333332297,
      "trackPct": 0.12351374328136444
    },
    "0.12375298": {
      "timeElapsedSinceStart": 18.283333333332294,
      "trackPct": 0.12396737933158875
    },
    "0.12427077": {
      "timeElapsedSinceStart": 18.366666666665623,
      "trackPct": 0.12472622841596603
    },
    "0.12478857": {
      "timeElapsedSinceStart": 18.41666666666562,
      "trackPct": 0.12518317997455597
    },
    "0.12530636": {
      "timeElapsedSinceStart": 18.466666666665617,
      "trackPct": 0.1256413459777832
    },
    "0.12582416": {
      "timeElapsedSinceStart": 18.49999999999895,
      "trackPct": 0.12594744563102722
    },
    "0.12634195": {
      "timeElapsedSinceStart": 18.549999999998946,
      "trackPct": 0.12640759348869324
    },
    "0.12685975": {
      "timeElapsedSinceStart": 18.599999999998943,
      "trackPct": 0.12686902284622192
    },
    "0.12737754": {
      "timeElapsedSinceStart": 18.699999999998937,
      "trackPct": 0.12779560685157776
    },
    "0.12789534": {
      "timeElapsedSinceStart": 18.73333333333227,
      "trackPct": 0.1281052529811859
    },
    "0.12841313": {
      "timeElapsedSinceStart": 18.783333333332266,
      "trackPct": 0.12857045233249664
    },
    "0.12893093": {
      "timeElapsedSinceStart": 18.833333333332263,
      "trackPct": 0.129036545753479
    },
    "0.12944872": {
      "timeElapsedSinceStart": 18.88333333333226,
      "trackPct": 0.12950357794761658
    },
    "0.12996652": {
      "timeElapsedSinceStart": 18.933333333332257,
      "trackPct": 0.12997154891490936
    },
    "0.13048431": {
      "timeElapsedSinceStart": 19.016666666665586,
      "trackPct": 0.13075357675552368
    },
    "0.13100211": {
      "timeElapsedSinceStart": 19.066666666665583,
      "trackPct": 0.13122409582138062
    },
    "0.1315199": {
      "timeElapsedSinceStart": 19.11666666666558,
      "trackPct": 0.13169558346271515
    },
    "0.1320377": {
      "timeElapsedSinceStart": 19.166666666665577,
      "trackPct": 0.13216803967952728
    },
    "0.13255549": {
      "timeElapsedSinceStart": 19.249999999998906,
      "trackPct": 0.13295763731002808
    },
    "0.13307329": {
      "timeElapsedSinceStart": 19.299999999998903,
      "trackPct": 0.13343261182308197
    },
    "0.13359108": {
      "timeElapsedSinceStart": 19.3499999999989,
      "trackPct": 0.1339084953069687
    },
    "0.13410888": {
      "timeElapsedSinceStart": 19.399999999998897,
      "trackPct": 0.13438533246517181
    },
    "0.13462667": {
      "timeElapsedSinceStart": 19.43333333333223,
      "trackPct": 0.13470375537872314
    },
    "0.13514446": {
      "timeElapsedSinceStart": 19.483333333332226,
      "trackPct": 0.13518214225769043
    },
    "0.13566226": {
      "timeElapsedSinceStart": 19.58333333333222,
      "trackPct": 0.13614106178283691
    },
    "0.13618005": {
      "timeElapsedSinceStart": 19.633333333332217,
      "trackPct": 0.13662193715572357
    },
    "0.13669785": {
      "timeElapsedSinceStart": 19.66666666666555,
      "trackPct": 0.13694320619106293
    },
    "0.13721564": {
      "timeElapsedSinceStart": 19.716666666665546,
      "trackPct": 0.13742615282535553
    },
    "0.13773344": {
      "timeElapsedSinceStart": 19.766666666665557,
      "trackPct": 0.1379103660583496
    },
    "0.13825123": {
      "timeElapsedSinceStart": 19.816666666665597,
      "trackPct": 0.1383957713842392
    },
    "0.13876903": {
      "timeElapsedSinceStart": 19.866666666665637,
      "trackPct": 0.13888166844844818
    },
    "0.13928682": {
      "timeElapsedSinceStart": 19.949999999999037,
      "trackPct": 0.1396891325712204
    },
    "0.13980462": {
      "timeElapsedSinceStart": 19.999999999999076,
      "trackPct": 0.1401703804731369
    },
    "0.14032241": {
      "timeElapsedSinceStart": 20.049999999999116,
      "trackPct": 0.14064791798591614
    },
    "0.14084021": {
      "timeElapsedSinceStart": 20.099999999999156,
      "trackPct": 0.14112071692943573
    },
    "0.141358": {
      "timeElapsedSinceStart": 20.133333333332516,
      "trackPct": 0.14143291115760803
    },
    "0.1418758": {
      "timeElapsedSinceStart": 20.183333333332556,
      "trackPct": 0.14189700782299042
    },
    "0.14239359": {
      "timeElapsedSinceStart": 20.283333333332635,
      "trackPct": 0.14280857145786285
    },
    "0.14291139": {
      "timeElapsedSinceStart": 20.333333333332675,
      "trackPct": 0.14325584471225739
    },
    "0.14342918": {
      "timeElapsedSinceStart": 20.366666666666035,
      "trackPct": 0.14355076849460602
    },
    "0.14394698": {
      "timeElapsedSinceStart": 20.416666666666075,
      "trackPct": 0.1439882218837738
    },
    "0.14446477": {
      "timeElapsedSinceStart": 20.516666666666154,
      "trackPct": 0.1448453813791275
    },
    "0.14498257": {
      "timeElapsedSinceStart": 20.549999999999514,
      "trackPct": 0.1451258361339569
    },
    "0.14550036": {
      "timeElapsedSinceStart": 20.599999999999554,
      "trackPct": 0.14554181694984436
    },
    "0.14601816": {
      "timeElapsedSinceStart": 20.699999999999633,
      "trackPct": 0.14635750651359558
    },
    "0.14653595": {
      "timeElapsedSinceStart": 20.749999999999673,
      "trackPct": 0.14675694704055786
    },
    "0.14705375": {
      "timeElapsedSinceStart": 20.833333333333073,
      "trackPct": 0.14740873873233795
    },
    "0.14757154": {
      "timeElapsedSinceStart": 20.883333333333113,
      "trackPct": 0.14779208600521088
    },
    "0.14808934": {
      "timeElapsedSinceStart": 20.933333333333152,
      "trackPct": 0.1481695920228958
    },
    "0.14860713": {
      "timeElapsedSinceStart": 21.016666666666552,
      "trackPct": 0.14878617227077484
    },
    "0.14912493": {
      "timeElapsedSinceStart": 21.066666666666592,
      "trackPct": 0.14914865791797638
    },
    "0.14964272": {
      "timeElapsedSinceStart": 21.16666666666667,
      "trackPct": 0.14985743165016174
    },
    "0.15016052": {
      "timeElapsedSinceStart": 21.21666666666671,
      "trackPct": 0.15020407736301422
    },
    "0.15067831": {
      "timeElapsedSinceStart": 21.30000000000011,
      "trackPct": 0.15077105164527893
    },
    "0.15119611": {
      "timeElapsedSinceStart": 21.40000000000019,
      "trackPct": 0.1514354944229126
    },
    "0.1517139": {
      "timeElapsedSinceStart": 21.45000000000023,
      "trackPct": 0.15176165103912354
    },
    "0.1522317": {
      "timeElapsedSinceStart": 21.53333333333363,
      "trackPct": 0.15229621529579163
    },
    "0.15274949": {
      "timeElapsedSinceStart": 21.63333333333371,
      "trackPct": 0.15291976928710938
    },
    "0.15326729": {
      "timeElapsedSinceStart": 21.71666666666711,
      "trackPct": 0.15342654287815094
    },
    "0.15378508": {
      "timeElapsedSinceStart": 21.81666666666719,
      "trackPct": 0.15401990711688995
    },
    "0.15430288": {
      "timeElapsedSinceStart": 21.86666666666723,
      "trackPct": 0.154310941696167
    },
    "0.15482067": {
      "timeElapsedSinceStart": 22.000000000000668,
      "trackPct": 0.1550695151090622
    },
    "0.15533847": {
      "timeElapsedSinceStart": 22.050000000000708,
      "trackPct": 0.1553475558757782
    },
    "0.15585626": {
      "timeElapsedSinceStart": 22.150000000000787,
      "trackPct": 0.15589401125907898
    },
    "0.15637406": {
      "timeElapsedSinceStart": 22.283333333334227,
      "trackPct": 0.15660473704338074
    },
    "0.15689185": {
      "timeElapsedSinceStart": 22.383333333334306,
      "trackPct": 0.15712560713291168
    },
    "0.15740964": {
      "timeElapsedSinceStart": 22.466666666667706,
      "trackPct": 0.15755115449428558
    },
    "0.15792744": {
      "timeElapsedSinceStart": 22.566666666667786,
      "trackPct": 0.15805229544639587
    },
    "0.15844523": {
      "timeElapsedSinceStart": 22.650000000001185,
      "trackPct": 0.15846316516399384
    },
    "0.15896303": {
      "timeElapsedSinceStart": 22.800000000001305,
      "trackPct": 0.15919144451618195
    },
    "0.15948082": {
      "timeElapsedSinceStart": 22.883333333334704,
      "trackPct": 0.159590482711792
    },
    "0.15999862": {
      "timeElapsedSinceStart": 22.983333333334784,
      "trackPct": 0.16006408631801605
    },
    "0.16051641": {
      "timeElapsedSinceStart": 23.083333333334863,
      "trackPct": 0.16053195297718048
    },
    "0.16103421": {
      "timeElapsedSinceStart": 23.216666666668303,
      "trackPct": 0.16114920377731323
    },
    "0.161552": {
      "timeElapsedSinceStart": 23.350000000001742,
      "trackPct": 0.16175894439220428
    },
    "0.1620698": {
      "timeElapsedSinceStart": 23.450000000001822,
      "trackPct": 0.1622135192155838
    },
    "0.16258759": {
      "timeElapsedSinceStart": 23.53333333333522,
      "trackPct": 0.16259144246578217
    },
    "0.16310539": {
      "timeElapsedSinceStart": 23.68333333333534,
      "trackPct": 0.16327089071273804
    },
    "0.16362318": {
      "timeElapsedSinceStart": 23.76666666666874,
      "trackPct": 0.16364853084087372
    },
    "0.16414098": {
      "timeElapsedSinceStart": 23.91666666666886,
      "trackPct": 0.1643303781747818
    },
    "0.16465877": {
      "timeElapsedSinceStart": 24.00000000000226,
      "trackPct": 0.16471028327941895
    },
    "0.16517657": {
      "timeElapsedSinceStart": 24.15000000000238,
      "trackPct": 0.16539756953716278
    },
    "0.16569436": {
      "timeElapsedSinceStart": 24.23333333333578,
      "trackPct": 0.16577871143817902
    },
    "0.16621216": {
      "timeElapsedSinceStart": 24.333333333335858,
      "trackPct": 0.16623562574386597
    },
    "0.16672995": {
      "timeElapsedSinceStart": 24.466666666669298,
      "trackPct": 0.1668429672718048
    },
    "0.16724775": {
      "timeElapsedSinceStart": 24.566666666669377,
      "trackPct": 0.1672968864440918
    },
    "0.16776554": {
      "timeElapsedSinceStart": 24.700000000002817,
      "trackPct": 0.16789941489696503
    },
    "0.16828334": {
      "timeElapsedSinceStart": 24.800000000002896,
      "trackPct": 0.16835002601146698
    },
    "0.16880113": {
      "timeElapsedSinceStart": 24.933333333336336,
      "trackPct": 0.16895116865634918
    },
    "0.16931893": {
      "timeElapsedSinceStart": 25.033333333336415,
      "trackPct": 0.16940343379974365
    },
    "0.16983672": {
      "timeElapsedSinceStart": 25.133333333336495,
      "trackPct": 0.16985660791397095
    },
    "0.17035452": {
      "timeElapsedSinceStart": 25.266666666669934,
      "trackPct": 0.17045924067497253
    },
    "0.17087231": {
      "timeElapsedSinceStart": 25.400000000003374,
      "trackPct": 0.17106370627880096
    },
    "0.17139011": {
      "timeElapsedSinceStart": 25.500000000003453,
      "trackPct": 0.17151960730552673
    },
    "0.1719079": {
      "timeElapsedSinceStart": 25.633333333336893,
      "trackPct": 0.17213255167007446
    },
    "0.1724257": {
      "timeElapsedSinceStart": 25.733333333336972,
      "trackPct": 0.17259784042835236
    },
    "0.17294349": {
      "timeElapsedSinceStart": 25.816666666670372,
      "trackPct": 0.172990620136261
    },
    "0.17346129": {
      "timeElapsedSinceStart": 25.91666666667045,
      "trackPct": 0.1734696328639984
    },
    "0.17397908": {
      "timeElapsedSinceStart": 26.05000000000389,
      "trackPct": 0.17412327229976654
    },
    "0.17449688": {
      "timeElapsedSinceStart": 26.15000000000397,
      "trackPct": 0.1746245175600052
    },
    "0.17501467": {
      "timeElapsedSinceStart": 26.25000000000405,
      "trackPct": 0.17513519525527954
    },
    "0.17553247": {
      "timeElapsedSinceStart": 26.33333333333745,
      "trackPct": 0.17556850612163544
    },
    "0.17605026": {
      "timeElapsedSinceStart": 26.43333333333753,
      "trackPct": 0.17609816789627075
    },
    "0.17656806": {
      "timeElapsedSinceStart": 26.53333333333761,
      "trackPct": 0.17663748562335968
    },
    "0.17708585": {
      "timeElapsedSinceStart": 26.61666666667101,
      "trackPct": 0.1770947128534317
    },
    "0.17760365": {
      "timeElapsedSinceStart": 26.716666666671088,
      "trackPct": 0.1776522845029831
    },
    "0.17812144": {
      "timeElapsedSinceStart": 26.800000000004488,
      "trackPct": 0.17812493443489075
    },
    "0.17863924": {
      "timeElapsedSinceStart": 26.900000000004567,
      "trackPct": 0.17870178818702698
    },
    "0.17915703": {
      "timeElapsedSinceStart": 26.983333333337967,
      "trackPct": 0.17919081449508667
    },
    "0.17967482": {
      "timeElapsedSinceStart": 27.083333333338047,
      "trackPct": 0.17978794872760773
    },
    "0.18019262": {
      "timeElapsedSinceStart": 27.183333333338126,
      "trackPct": 0.18039654195308685
    },
    "0.18071041": {
      "timeElapsedSinceStart": 27.266666666671526,
      "trackPct": 0.1809101551771164
    },
    "0.18122821": {
      "timeElapsedSinceStart": 27.366666666671605,
      "trackPct": 0.18152448534965515
    },
    "0.181746": {
      "timeElapsedSinceStart": 27.416666666671645,
      "trackPct": 0.18182839453220367
    },
    "0.1822638": {
      "timeElapsedSinceStart": 27.500000000005045,
      "trackPct": 0.18232786655426025
    },
    "0.18278159": {
      "timeElapsedSinceStart": 27.600000000005124,
      "trackPct": 0.18291382491588593
    },
    "0.18329939": {
      "timeElapsedSinceStart": 27.700000000005204,
      "trackPct": 0.18348580598831177
    },
    "0.18381718": {
      "timeElapsedSinceStart": 27.783333333338604,
      "trackPct": 0.18395182490348816
    },
    "0.18433498": {
      "timeElapsedSinceStart": 27.883333333338683,
      "trackPct": 0.18449808657169342
    },
    "0.18485277": {
      "timeElapsedSinceStart": 27.966666666672083,
      "trackPct": 0.18494272232055664
    },
    "0.18537057": {
      "timeElapsedSinceStart": 28.066666666672162,
      "trackPct": 0.18546387553215027
    },
    "0.18588836": {
      "timeElapsedSinceStart": 28.150000000005562,
      "trackPct": 0.18588851392269135
    },
    "0.18640616": {
      "timeElapsedSinceStart": 28.30000000000568,
      "trackPct": 0.18662896752357483
    },
    "0.18692395": {
      "timeElapsedSinceStart": 28.38333333333908,
      "trackPct": 0.18702857196331024
    },
    "0.18744175": {
      "timeElapsedSinceStart": 28.48333333333916,
      "trackPct": 0.1875002086162567
    },
    "0.18795954": {
      "timeElapsedSinceStart": 28.58333333333924,
      "trackPct": 0.1879657357931137
    },
    "0.18847734": {
      "timeElapsedSinceStart": 28.71666666667268,
      "trackPct": 0.18857978284358978
    },
    "0.18899513": {
      "timeElapsedSinceStart": 28.81666666667276,
      "trackPct": 0.1890363246202469
    },
    "0.18951293": {
      "timeElapsedSinceStart": 28.9500000000062,
      "trackPct": 0.1896413266658783
    },
    "0.19003072": {
      "timeElapsedSinceStart": 29.05000000000628,
      "trackPct": 0.1900927871465683
    },
    "0.19054852": {
      "timeElapsedSinceStart": 29.183333333339718,
      "trackPct": 0.19069290161132812
    },
    "0.19106631": {
      "timeElapsedSinceStart": 29.283333333339797,
      "trackPct": 0.19114042818546295
    },
    "0.19158411": {
      "timeElapsedSinceStart": 29.416666666673237,
      "trackPct": 0.19173400104045868
    },
    "0.1921019": {
      "timeElapsedSinceStart": 29.516666666673316,
      "trackPct": 0.19217677414417267
    },
    "0.1926197": {
      "timeElapsedSinceStart": 29.650000000006756,
      "trackPct": 0.1927647739648819
    },
    "0.19313749": {
      "timeElapsedSinceStart": 29.750000000006835,
      "trackPct": 0.19320398569107056
    },
    "0.19365529": {
      "timeElapsedSinceStart": 29.883333333340275,
      "trackPct": 0.1937876045703888
    },
    "0.19417308": {
      "timeElapsedSinceStart": 29.983333333340354,
      "trackPct": 0.1942235231399536
    },
    "0.19469088": {
      "timeElapsedSinceStart": 30.116666666673794,
      "trackPct": 0.1948043704032898
    },
    "0.19520867": {
      "timeElapsedSinceStart": 30.216666666673873,
      "trackPct": 0.19523917138576508
    },
    "0.19572647": {
      "timeElapsedSinceStart": 30.350000000007313,
      "trackPct": 0.19581755995750427
    },
    "0.19624426": {
      "timeElapsedSinceStart": 30.450000000007392,
      "trackPct": 0.19624876976013184
    },
    "0.19676206": {
      "timeElapsedSinceStart": 30.583333333340832,
      "trackPct": 0.1968231350183487
    },
    "0.19727985": {
      "timeElapsedSinceStart": 30.71666666667427,
      "trackPct": 0.19739781320095062
    },
    "0.19779765": {
      "timeElapsedSinceStart": 30.81666666667435,
      "trackPct": 0.19783073663711548
    },
    "0.19831544": {
      "timeElapsedSinceStart": 30.95000000000779,
      "trackPct": 0.1984136402606964
    },
    "0.19883324": {
      "timeElapsedSinceStart": 31.05000000000787,
      "trackPct": 0.19885793328285217
    },
    "0.19935103": {
      "timeElapsedSinceStart": 31.18333333334131,
      "trackPct": 0.19946525990962982
    },
    "0.19986883": {
      "timeElapsedSinceStart": 31.28333333334139,
      "trackPct": 0.1999361664056778
    },
    "0.20038662": {
      "timeElapsedSinceStart": 31.38333333334147,
      "trackPct": 0.20042215287685394
    },
    "0.20090442": {
      "timeElapsedSinceStart": 31.516666666674908,
      "trackPct": 0.2010859251022339
    },
    "0.20142221": {
      "timeElapsedSinceStart": 31.600000000008308,
      "trackPct": 0.20151127874851227
    },
    "0.20194": {
      "timeElapsedSinceStart": 31.700000000008387,
      "trackPct": 0.20203153789043427
    },
    "0.2024578": {
      "timeElapsedSinceStart": 31.800000000008467,
      "trackPct": 0.20256201922893524
    },
    "0.20297559": {
      "timeElapsedSinceStart": 31.883333333341866,
      "trackPct": 0.20301181077957153
    },
    "0.20349339": {
      "timeElapsedSinceStart": 31.983333333341946,
      "trackPct": 0.20356053113937378
    },
    "0.20401118": {
      "timeElapsedSinceStart": 32.066666666675346,
      "trackPct": 0.20402540266513824
    },
    "0.20452898": {
      "timeElapsedSinceStart": 32.166666666675425,
      "trackPct": 0.20459260046482086
    },
    "0.20504677": {
      "timeElapsedSinceStart": 32.266666666675505,
      "trackPct": 0.20517006516456604
    },
    "0.20556457": {
      "timeElapsedSinceStart": 32.350000000008905,
      "trackPct": 0.2056593894958496
    },
    "0.20608236": {
      "timeElapsedSinceStart": 32.450000000008984,
      "trackPct": 0.20625613629817963
    },
    "0.20660016": {
      "timeElapsedSinceStart": 32.533333333342384,
      "trackPct": 0.2067602425813675
    },
    "0.20711795": {
      "timeElapsedSinceStart": 32.63333333334246,
      "trackPct": 0.20737417042255402
    },
    "0.20763575": {
      "timeElapsedSinceStart": 32.6833333333425,
      "trackPct": 0.2076847404241562
    },
    "0.20815354": {
      "timeElapsedSinceStart": 32.78333333334258,
      "trackPct": 0.20831298828125
    },
    "0.20867134": {
      "timeElapsedSinceStart": 32.86666666667598,
      "trackPct": 0.20884095132350922
    },
    "0.20918913": {
      "timeElapsedSinceStart": 32.96666666667606,
      "trackPct": 0.20948025584220886
    },
    "0.20970693": {
      "timeElapsedSinceStart": 33.05000000000946,
      "trackPct": 0.2100193053483963
    },
    "0.21022472": {
      "timeElapsedSinceStart": 33.1000000000095,
      "trackPct": 0.21034544706344604
    },
    "0.21074252": {
      "timeElapsedSinceStart": 33.20000000000958,
      "trackPct": 0.2110036015510559
    },
    "0.21126031": {
      "timeElapsedSinceStart": 33.28333333334298,
      "trackPct": 0.21155789494514465
    },
    "0.21177811": {
      "timeElapsedSinceStart": 33.33333333334302,
      "trackPct": 0.21189305186271667
    },
    "0.2122959": {
      "timeElapsedSinceStart": 33.4333333333431,
      "trackPct": 0.21256913244724274
    },
    "0.2128137": {
      "timeElapsedSinceStart": 33.48333333334314,
      "trackPct": 0.2129105031490326
    },
    "0.21333149": {
      "timeElapsedSinceStart": 33.56666666667654,
      "trackPct": 0.21348516643047333
    },
    "0.21384929": {
      "timeElapsedSinceStart": 33.66666666667662,
      "trackPct": 0.2141818106174469
    },
    "0.21436708": {
      "timeElapsedSinceStart": 33.70000000000998,
      "trackPct": 0.2144157737493515
    },
    "0.21488488": {
      "timeElapsedSinceStart": 33.80000000001006,
      "trackPct": 0.21512261033058167
    },
    "0.21540267": {
      "timeElapsedSinceStart": 33.8500000000101,
      "trackPct": 0.21547889709472656
    },
    "0.21592047": {
      "timeElapsedSinceStart": 33.9333333333435,
      "trackPct": 0.2160770148038864
    },
    "0.21643826": {
      "timeElapsedSinceStart": 33.98333333334354,
      "trackPct": 0.2164383828639984
    },
    "0.21695606": {
      "timeElapsedSinceStart": 34.08333333334362,
      "trackPct": 0.2171667069196701
    },
    "0.21747385": {
      "timeElapsedSinceStart": 34.13333333334366,
      "trackPct": 0.2175336331129074
    },
    "0.21799165": {
      "timeElapsedSinceStart": 34.21666666667706,
      "trackPct": 0.21814925968647003
    },
    "0.21850944": {
      "timeElapsedSinceStart": 34.2666666666771,
      "trackPct": 0.21852104365825653
    },
    "0.21902724": {
      "timeElapsedSinceStart": 34.366666666677176,
      "trackPct": 0.21926996111869812
    },
    "0.21954503": {
      "timeElapsedSinceStart": 34.450000000010576,
      "trackPct": 0.2198992371559143
    },
    "0.22006283": {
      "timeElapsedSinceStart": 34.500000000010616,
      "trackPct": 0.22027871012687683
    },
    "0.22058062": {
      "timeElapsedSinceStart": 34.550000000010655,
      "trackPct": 0.2206597477197647
    },
    "0.22109842": {
      "timeElapsedSinceStart": 34.633333333344055,
      "trackPct": 0.22129878401756287
    },
    "0.22161621": {
      "timeElapsedSinceStart": 34.683333333344095,
      "trackPct": 0.2216845601797104
    },
    "0.22213401": {
      "timeElapsedSinceStart": 34.783333333344174,
      "trackPct": 0.22246138751506805
    },
    "0.2226518": {
      "timeElapsedSinceStart": 34.833333333344214,
      "trackPct": 0.22285239398479462
    },
    "0.2231696": {
      "timeElapsedSinceStart": 34.916666666677614,
      "trackPct": 0.2235078513622284
    },
    "0.22368739": {
      "timeElapsedSinceStart": 34.96666666667765,
      "trackPct": 0.22390343248844147
    },
    "0.22420518": {
      "timeElapsedSinceStart": 35.01666666667769,
      "trackPct": 0.22430069744586945
    },
    "0.22472298": {
      "timeElapsedSinceStart": 35.10000000001109,
      "trackPct": 0.2249666154384613
    },
    "0.22524077": {
      "timeElapsedSinceStart": 35.15000000001113,
      "trackPct": 0.2253684401512146
    },
    "0.22575857": {
      "timeElapsedSinceStart": 35.20000000001117,
      "trackPct": 0.22577205300331116
    },
    "0.22627636": {
      "timeElapsedSinceStart": 35.30000000001125,
      "trackPct": 0.22658462822437286
    },
    "0.22679416": {
      "timeElapsedSinceStart": 35.33333333334461,
      "trackPct": 0.2268570512533188
    },
    "0.22731195": {
      "timeElapsedSinceStart": 35.43333333334469,
      "trackPct": 0.2276793122291565
    },
    "0.22782975": {
      "timeElapsedSinceStart": 35.48333333334473,
      "trackPct": 0.22809270024299622
    },
    "0.22834754": {
      "timeElapsedSinceStart": 35.53333333334477,
      "trackPct": 0.2285074144601822
    },
    "0.22886534": {
      "timeElapsedSinceStart": 35.61666666667817,
      "trackPct": 0.22920174896717072
    },
    "0.22938313": {
      "timeElapsedSinceStart": 35.66666666667821,
      "trackPct": 0.2296203374862671
    },
    "0.22990093": {
      "timeElapsedSinceStart": 35.71666666667825,
      "trackPct": 0.2300395518541336
    },
    "0.23041872": {
      "timeElapsedSinceStart": 35.80000000001165,
      "trackPct": 0.2307397723197937
    },
    "0.23093652": {
      "timeElapsedSinceStart": 35.85000000001169,
      "trackPct": 0.23116180300712585
    },
    "0.23145431": {
      "timeElapsedSinceStart": 35.90000000001173,
      "trackPct": 0.2315853238105774
    },
    "0.23197211": {
      "timeElapsedSinceStart": 35.95000000001177,
      "trackPct": 0.23201023042201996
    },
    "0.2324899": {
      "timeElapsedSinceStart": 36.03333333334517,
      "trackPct": 0.23272156715393066
    },
    "0.2330077": {
      "timeElapsedSinceStart": 36.08333333334521,
      "trackPct": 0.23315024375915527
    },
    "0.23352549": {
      "timeElapsedSinceStart": 36.13333333334525,
      "trackPct": 0.2335803508758545
    },
    "0.23404329": {
      "timeElapsedSinceStart": 36.21666666667865,
      "trackPct": 0.23430033028125763
    },
    "0.23456108": {
      "timeElapsedSinceStart": 36.26666666667869,
      "trackPct": 0.23473423719406128
    },
    "0.23507888": {
      "timeElapsedSinceStart": 36.31666666667873,
      "trackPct": 0.23516954481601715
    },
    "0.23559667": {
      "timeElapsedSinceStart": 36.36666666667877,
      "trackPct": 0.23560629785060883
    },
    "0.23611447": {
      "timeElapsedSinceStart": 36.45000000001217,
      "trackPct": 0.23633736371994019
    },
    "0.23663226": {
      "timeElapsedSinceStart": 36.50000000001221,
      "trackPct": 0.23677776753902435
    },
    "0.23715006": {
      "timeElapsedSinceStart": 36.55000000001225,
      "trackPct": 0.23721946775913239
    },
    "0.23766785": {
      "timeElapsedSinceStart": 36.65000000001233,
      "trackPct": 0.2381065934896469
    },
    "0.23818565": {
      "timeElapsedSinceStart": 36.683333333345686,
      "trackPct": 0.23840343952178955
    },
    "0.23870344": {
      "timeElapsedSinceStart": 36.733333333345726,
      "trackPct": 0.23884975910186768
    },
    "0.23922124": {
      "timeElapsedSinceStart": 36.783333333345766,
      "trackPct": 0.23929740488529205
    },
    "0.23973903": {
      "timeElapsedSinceStart": 36.833333333345806,
      "trackPct": 0.2397463470697403
    },
    "0.24025683": {
      "timeElapsedSinceStart": 36.933333333345885,
      "trackPct": 0.24064815044403076
    },
    "0.24077462": {
      "timeElapsedSinceStart": 36.966666666679245,
      "trackPct": 0.24094995856285095
    },
    "0.24129242": {
      "timeElapsedSinceStart": 37.016666666679285,
      "trackPct": 0.241403728723526
    },
    "0.24181021": {
      "timeElapsedSinceStart": 37.066666666679325,
      "trackPct": 0.2418588399887085
    },
    "0.24232801": {
      "timeElapsedSinceStart": 37.150000000012724,
      "trackPct": 0.2426203489303589
    },
    "0.2428458": {
      "timeElapsedSinceStart": 37.200000000012764,
      "trackPct": 0.2430790215730667
    },
    "0.2433636": {
      "timeElapsedSinceStart": 37.250000000012804,
      "trackPct": 0.24353905022144318
    },
    "0.24388139": {
      "timeElapsedSinceStart": 37.300000000012844,
      "trackPct": 0.24400043487548828
    },
    "0.24439919": {
      "timeElapsedSinceStart": 37.350000000012884,
      "trackPct": 0.24446316063404083
    },
    "0.24491698": {
      "timeElapsedSinceStart": 37.43333333334628,
      "trackPct": 0.24523764848709106
    },
    "0.24543478": {
      "timeElapsedSinceStart": 37.48333333334632,
      "trackPct": 0.2457042634487152
    },
    "0.24595257": {
      "timeElapsedSinceStart": 37.53333333334636,
      "trackPct": 0.24617207050323486
    },
    "0.24647036": {
      "timeElapsedSinceStart": 37.5833333333464,
      "trackPct": 0.24664098024368286
    },
    "0.24698816": {
      "timeElapsedSinceStart": 37.6666666666798,
      "trackPct": 0.24742498993873596
    },
    "0.24750595": {
      "timeElapsedSinceStart": 37.71666666667984,
      "trackPct": 0.24789686501026154
    },
    "0.24802375": {
      "timeElapsedSinceStart": 37.76666666667988,
      "trackPct": 0.24836984276771545
    },
    "0.24854154": {
      "timeElapsedSinceStart": 37.81666666667992,
      "trackPct": 0.2488439679145813
    },
    "0.24905934": {
      "timeElapsedSinceStart": 37.85000000001328,
      "trackPct": 0.24916067719459534
    },
    "0.24957713": {
      "timeElapsedSinceStart": 37.90000000001332,
      "trackPct": 0.2496366947889328
    },
    "0.25009493": {
      "timeElapsedSinceStart": 37.95000000001336,
      "trackPct": 0.2501138746738434
    },
    "0.25061272": {
      "timeElapsedSinceStart": 38.05000000001344,
      "trackPct": 0.2510716915130615
    },
    "0.25113052": {
      "timeElapsedSinceStart": 38.0833333333468,
      "trackPct": 0.2513919770717621
    },
    "0.25164831": {
      "timeElapsedSinceStart": 38.13333333334684,
      "trackPct": 0.2518734335899353
    },
    "0.25216611": {
      "timeElapsedSinceStart": 38.18333333334688,
      "trackPct": 0.25235605239868164
    },
    "0.2526839": {
      "timeElapsedSinceStart": 38.23333333334692,
      "trackPct": 0.2528398633003235
    },
    "0.2532017": {
      "timeElapsedSinceStart": 38.28333333334696,
      "trackPct": 0.2533248960971832
    },
    "0.25371949": {
      "timeElapsedSinceStart": 38.36666666668036,
      "trackPct": 0.2541358470916748
    },
    "0.25423729": {
      "timeElapsedSinceStart": 38.4166666666804,
      "trackPct": 0.2546234726905823
    },
    "0.25475508": {
      "timeElapsedSinceStart": 38.46666666668044,
      "trackPct": 0.2551119327545166
    },
    "0.25527288": {
      "timeElapsedSinceStart": 38.51666666668048,
      "trackPct": 0.25560128688812256
    },
    "0.25579067": {
      "timeElapsedSinceStart": 38.55000000001384,
      "trackPct": 0.25592803955078125
    },
    "0.25630847": {
      "timeElapsedSinceStart": 38.60000000001388,
      "trackPct": 0.256418913602829
    },
    "0.25682626": {
      "timeElapsedSinceStart": 38.65000000001392,
      "trackPct": 0.2569107413291931
    },
    "0.25734406": {
      "timeElapsedSinceStart": 38.70000000001396,
      "trackPct": 0.25740349292755127
    },
    "0.25786185": {
      "timeElapsedSinceStart": 38.750000000014,
      "trackPct": 0.25789719820022583
    },
    "0.25837965": {
      "timeElapsedSinceStart": 38.8333333333474,
      "trackPct": 0.2587222158908844
    },
    "0.25889744": {
      "timeElapsedSinceStart": 38.88333333334744,
      "trackPct": 0.2592185139656067
    },
    "0.25941524": {
      "timeElapsedSinceStart": 38.93333333334748,
      "trackPct": 0.2597157657146454
    },
    "0.25993303": {
      "timeElapsedSinceStart": 38.98333333334752,
      "trackPct": 0.2602139711380005
    },
    "0.26045083": {
      "timeElapsedSinceStart": 39.03333333334756,
      "trackPct": 0.260713130235672
    },
    "0.26096862": {
      "timeElapsedSinceStart": 39.066666666680916,
      "trackPct": 0.261046439409256
    },
    "0.26148642": {
      "timeElapsedSinceStart": 39.116666666680956,
      "trackPct": 0.2615472078323364
    },
    "0.26200421": {
      "timeElapsedSinceStart": 39.166666666680996,
      "trackPct": 0.26204898953437805
    },
    "0.26252201": {
      "timeElapsedSinceStart": 39.216666666681036,
      "trackPct": 0.2625516653060913
    },
    "0.2630398": {
      "timeElapsedSinceStart": 39.300000000014435,
      "trackPct": 0.2633916139602661
    },
    "0.2635576": {
      "timeElapsedSinceStart": 39.350000000014475,
      "trackPct": 0.2638966739177704
    },
    "0.26407539": {
      "timeElapsedSinceStart": 39.400000000014515,
      "trackPct": 0.2644025683403015
    },
    "0.26459319": {
      "timeElapsedSinceStart": 39.450000000014555,
      "trackPct": 0.2649094760417938
    },
    "0.26511098": {
      "timeElapsedSinceStart": 39.500000000014595,
      "trackPct": 0.26541733741760254
    },
    "0.26562878": {
      "timeElapsedSinceStart": 39.533333333347954,
      "trackPct": 0.26575642824172974
    },
    "0.26614657": {
      "timeElapsedSinceStart": 39.583333333347994,
      "trackPct": 0.266265869140625
    },
    "0.26666437": {
      "timeElapsedSinceStart": 39.633333333348034,
      "trackPct": 0.2667762041091919
    },
    "0.26718216": {
      "timeElapsedSinceStart": 39.683333333348074,
      "trackPct": 0.2672874629497528
    },
    "0.26769996": {
      "timeElapsedSinceStart": 39.733333333348114,
      "trackPct": 0.26779964566230774
    },
    "0.26821775": {
      "timeElapsedSinceStart": 39.81666666668151,
      "trackPct": 0.26865559816360474
    },
    "0.26873554": {
      "timeElapsedSinceStart": 39.86666666668155,
      "trackPct": 0.26917049288749695
    },
    "0.26925334": {
      "timeElapsedSinceStart": 39.91666666668159,
      "trackPct": 0.26968643069267273
    },
    "0.26977113": {
      "timeElapsedSinceStart": 39.96666666668163,
      "trackPct": 0.2702022194862366
    },
    "0.27028893": {
      "timeElapsedSinceStart": 40.00000000001499,
      "trackPct": 0.2705463767051697
    },
    "0.27080672": {
      "timeElapsedSinceStart": 40.05000000001503,
      "trackPct": 0.27106374502182007
    },
    "0.27132452": {
      "timeElapsedSinceStart": 40.10000000001507,
      "trackPct": 0.2715821862220764
    },
    "0.27184231": {
      "timeElapsedSinceStart": 40.15000000001511,
      "trackPct": 0.27210181951522827
    },
    "0.27236011": {
      "timeElapsedSinceStart": 40.20000000001515,
      "trackPct": 0.27262264490127563
    },
    "0.2728779": {
      "timeElapsedSinceStart": 40.23333333334851,
      "trackPct": 0.272970587015152
    },
    "0.2733957": {
      "timeElapsedSinceStart": 40.28333333334855,
      "trackPct": 0.27349352836608887
    },
    "0.27391349": {
      "timeElapsedSinceStart": 40.33333333334859,
      "trackPct": 0.2740176022052765
    },
    "0.27443129": {
      "timeElapsedSinceStart": 40.38333333334863,
      "trackPct": 0.2745426297187805
    },
    "0.27494908": {
      "timeElapsedSinceStart": 40.43333333334867,
      "trackPct": 0.2750685513019562
    },
    "0.27546688": {
      "timeElapsedSinceStart": 40.51666666668207,
      "trackPct": 0.2759472131729126
    },
    "0.27598467": {
      "timeElapsedSinceStart": 40.56666666668211,
      "trackPct": 0.2764756679534912
    },
    "0.27650247": {
      "timeElapsedSinceStart": 40.61666666668215,
      "trackPct": 0.27700504660606384
    },
    "0.27702026": {
      "timeElapsedSinceStart": 40.65000000001551,
      "trackPct": 0.27735844254493713
    },
    "0.27753806": {
      "timeElapsedSinceStart": 40.70000000001555,
      "trackPct": 0.27788934111595154
    },
    "0.27805585": {
      "timeElapsedSinceStart": 40.75000000001559,
      "trackPct": 0.2784210741519928
    },
    "0.27857365": {
      "timeElapsedSinceStart": 40.80000000001563,
      "trackPct": 0.2789536714553833
    },
    "0.27909144": {
      "timeElapsedSinceStart": 40.85000000001567,
      "trackPct": 0.27948713302612305
    },
    "0.27960924": {
      "timeElapsedSinceStart": 40.90000000001571,
      "trackPct": 0.2800213694572449
    },
    "0.28012703": {
      "timeElapsedSinceStart": 40.93333333334907,
      "trackPct": 0.2803780138492584
    },
    "0.28064483": {
      "timeElapsedSinceStart": 40.98333333334911,
      "trackPct": 0.2809135913848877
    },
    "0.28116262": {
      "timeElapsedSinceStart": 41.03333333334915,
      "trackPct": 0.2814498841762543
    },
    "0.28168042": {
      "timeElapsedSinceStart": 41.08333333334919,
      "trackPct": 0.2819865643978119
    },
    "0.28219821": {
      "timeElapsedSinceStart": 41.11666666668255,
      "trackPct": 0.2823444604873657
    },
    "0.28271601": {
      "timeElapsedSinceStart": 41.16666666668259,
      "trackPct": 0.2828814387321472
    },
    "0.2832338": {
      "timeElapsedSinceStart": 41.21666666668263,
      "trackPct": 0.2834186255931854
    },
    "0.2837516": {
      "timeElapsedSinceStart": 41.26666666668267,
      "trackPct": 0.28395599126815796
    },
    "0.28426939": {
      "timeElapsedSinceStart": 41.31666666668271,
      "trackPct": 0.2844937741756439
    },
    "0.28478719": {
      "timeElapsedSinceStart": 41.35000000001607,
      "trackPct": 0.28485265374183655
    },
    "0.28530498": {
      "timeElapsedSinceStart": 41.40000000001611,
      "trackPct": 0.2853914797306061
    },
    "0.28582278": {
      "timeElapsedSinceStart": 41.450000000016146,
      "trackPct": 0.2859309911727905
    },
    "0.28634057": {
      "timeElapsedSinceStart": 41.500000000016186,
      "trackPct": 0.28647127747535706
    },
    "0.28685837": {
      "timeElapsedSinceStart": 41.550000000016226,
      "trackPct": 0.28701239824295044
    },
    "0.28789396": {
      "timeElapsedSinceStart": 41.633333333349626,
      "trackPct": 0.28791630268096924
    },
    "0.28841175": {
      "timeElapsedSinceStart": 41.683333333349665,
      "trackPct": 0.2884599566459656
    },
    "0.28892955": {
      "timeElapsedSinceStart": 41.733333333349705,
      "trackPct": 0.28900468349456787
    },
    "0.28944734": {
      "timeElapsedSinceStart": 41.783333333349745,
      "trackPct": 0.28955045342445374
    },
    "0.28996514": {
      "timeElapsedSinceStart": 41.866666666683145,
      "trackPct": 0.2904623746871948
    },
    "0.29100072": {
      "timeElapsedSinceStart": 41.916666666683184,
      "trackPct": 0.29101085662841797
    },
    "0.29151852": {
      "timeElapsedSinceStart": 41.966666666683224,
      "trackPct": 0.2915603518486023
    },
    "0.29203631": {
      "timeElapsedSinceStart": 42.050000000016624,
      "trackPct": 0.2924783229827881
    },
    "0.29255411": {
      "timeElapsedSinceStart": 42.100000000016664,
      "trackPct": 0.2930302917957306
    },
    "0.2930719": {
      "timeElapsedSinceStart": 42.1500000000167,
      "trackPct": 0.2935831844806671
    },
    "0.29410749": {
      "timeElapsedSinceStart": 42.20000000001674,
      "trackPct": 0.29413706064224243
    },
    "0.29462529": {
      "timeElapsedSinceStart": 42.28333333335014,
      "trackPct": 0.2950621247291565
    },
    "0.29514308": {
      "timeElapsedSinceStart": 42.33333333335018,
      "trackPct": 0.29561829566955566
    },
    "0.29566088": {
      "timeElapsedSinceStart": 42.38333333335022,
      "trackPct": 0.2961753010749817
    },
    "0.29669647": {
      "timeElapsedSinceStart": 42.43333333335026,
      "trackPct": 0.2967330515384674
    },
    "0.29721426": {
      "timeElapsedSinceStart": 42.51666666668366,
      "trackPct": 0.2976643741130829
    },
    "0.29773206": {
      "timeElapsedSinceStart": 42.5666666666837,
      "trackPct": 0.29822415113449097
    },
    "0.29876765": {
      "timeElapsedSinceStart": 42.61666666668374,
      "trackPct": 0.2987847328186035
    },
    "0.29928544": {
      "timeElapsedSinceStart": 42.66666666668378,
      "trackPct": 0.299345999956131
    },
    "0.29980324": {
      "timeElapsedSinceStart": 42.75000000001718,
      "trackPct": 0.3002830147743225
    },
    "0.30083883": {
      "timeElapsedSinceStart": 42.80000000001722,
      "trackPct": 0.3008461594581604
    },
    "0.30135662": {
      "timeElapsedSinceStart": 42.85000000001726,
      "trackPct": 0.3014099895954132
    },
    "0.30187442": {
      "timeElapsedSinceStart": 42.9000000000173,
      "trackPct": 0.30197450518608093
    },
    "0.30291001": {
      "timeElapsedSinceStart": 42.9833333333507,
      "trackPct": 0.30291685461997986
    },
    "0.3034278": {
      "timeElapsedSinceStart": 43.03333333335074,
      "trackPct": 0.30348312854766846
    },
    "0.3039456": {
      "timeElapsedSinceStart": 43.08333333335078,
      "trackPct": 0.3040500283241272
    },
    "0.30446339": {
      "timeElapsedSinceStart": 43.13333333335082,
      "trackPct": 0.3046174645423889
    },
    "0.30498119": {
      "timeElapsedSinceStart": 43.16666666668418,
      "trackPct": 0.3049960136413574
    },
    "0.30549898": {
      "timeElapsedSinceStart": 43.21666666668422,
      "trackPct": 0.305564284324646
    },
    "0.30601678": {
      "timeElapsedSinceStart": 43.26666666668426,
      "trackPct": 0.3061327040195465
    },
    "0.30653457": {
      "timeElapsedSinceStart": 43.3166666666843,
      "trackPct": 0.30670058727264404
    },
    "0.30705237": {
      "timeElapsedSinceStart": 43.36666666668434,
      "trackPct": 0.3072667419910431
    },
    "0.30757016": {
      "timeElapsedSinceStart": 43.4000000000177,
      "trackPct": 0.30764278769493103
    },
    "0.30808796": {
      "timeElapsedSinceStart": 43.45000000001774,
      "trackPct": 0.30820417404174805
    },
    "0.30860575": {
      "timeElapsedSinceStart": 43.50000000001778,
      "trackPct": 0.3087611198425293
    },
    "0.30912355": {
      "timeElapsedSinceStart": 43.55000000001782,
      "trackPct": 0.30931374430656433
    },
    "0.30964134": {
      "timeElapsedSinceStart": 43.60000000001786,
      "trackPct": 0.3098616302013397
    },
    "0.31015914": {
      "timeElapsedSinceStart": 43.63333333335122,
      "trackPct": 0.3102242946624756
    },
    "0.31067693": {
      "timeElapsedSinceStart": 43.68333333335126,
      "trackPct": 0.3107644319534302
    },
    "0.31119473": {
      "timeElapsedSinceStart": 43.7333333333513,
      "trackPct": 0.31129997968673706
    },
    "0.31171252": {
      "timeElapsedSinceStart": 43.78333333335134,
      "trackPct": 0.3118310570716858
    },
    "0.31223032": {
      "timeElapsedSinceStart": 43.833333333351376,
      "trackPct": 0.3123577833175659
    },
    "0.31274811": {
      "timeElapsedSinceStart": 43.916666666684776,
      "trackPct": 0.3132261037826538
    },
    "0.3132659": {
      "timeElapsedSinceStart": 43.966666666684816,
      "trackPct": 0.3137412667274475
    },
    "0.3137837": {
      "timeElapsedSinceStart": 44.016666666684856,
      "trackPct": 0.31425195932388306
    },
    "0.31430149": {
      "timeElapsedSinceStart": 44.050000000018215,
      "trackPct": 0.3145899176597595
    },
    "0.31481929": {
      "timeElapsedSinceStart": 44.100000000018255,
      "trackPct": 0.31509310007095337
    },
    "0.31533708": {
      "timeElapsedSinceStart": 44.150000000018295,
      "trackPct": 0.3155916631221771
    },
    "0.31585488": {
      "timeElapsedSinceStart": 44.200000000018335,
      "trackPct": 0.316085547208786
    },
    "0.31637267": {
      "timeElapsedSinceStart": 44.250000000018375,
      "trackPct": 0.31657469272613525
    },
    "0.31689047": {
      "timeElapsedSinceStart": 44.283333333351734,
      "trackPct": 0.31689804792404175
    },
    "0.31740826": {
      "timeElapsedSinceStart": 44.383333333351814,
      "trackPct": 0.31785503029823303
    },
    "0.31792606": {
      "timeElapsedSinceStart": 44.433333333351854,
      "trackPct": 0.3183262050151825
    },
    "0.31844385": {
      "timeElapsedSinceStart": 44.483333333351894,
      "trackPct": 0.31879231333732605
    },
    "0.31896165": {
      "timeElapsedSinceStart": 44.51666666668525,
      "trackPct": 0.319099485874176
    },
    "0.31947944": {
      "timeElapsedSinceStart": 44.56666666668529,
      "trackPct": 0.31955522298812866
    },
    "0.31999724": {
      "timeElapsedSinceStart": 44.61666666668533,
      "trackPct": 0.3200049102306366
    },
    "0.32051503": {
      "timeElapsedSinceStart": 44.71666666668541,
      "trackPct": 0.32088518142700195
    },
    "0.32103283": {
      "timeElapsedSinceStart": 44.75000000001877,
      "trackPct": 0.32117295265197754
    },
    "0.32155062": {
      "timeElapsedSinceStart": 44.80000000001881,
      "trackPct": 0.3215993344783783
    },
    "0.32206842": {
      "timeElapsedSinceStart": 44.90000000001889,
      "trackPct": 0.3224337697029114
    },
    "0.32258621": {
      "timeElapsedSinceStart": 44.95000000001893,
      "trackPct": 0.3228408098220825
    },
    "0.32310401": {
      "timeElapsedSinceStart": 44.98333333335229,
      "trackPct": 0.3231085538864136
    },
    "0.3236218": {
      "timeElapsedSinceStart": 45.08333333335237,
      "trackPct": 0.323894739151001
    },
    "0.3241396": {
      "timeElapsedSinceStart": 45.13333333335241,
      "trackPct": 0.3242782950401306
    },
    "0.32465739": {
      "timeElapsedSinceStart": 45.21666666668581,
      "trackPct": 0.3249031603336334
    },
    "0.32517519": {
      "timeElapsedSinceStart": 45.26666666668585,
      "trackPct": 0.32526957988739014
    },
    "0.32569298": {
      "timeElapsedSinceStart": 45.36666666668593,
      "trackPct": 0.3259850740432739
    },
    "0.32621078": {
      "timeElapsedSinceStart": 45.41666666668597,
      "trackPct": 0.32633450627326965
    },
    "0.32672857": {
      "timeElapsedSinceStart": 45.50000000001937,
      "trackPct": 0.3269050717353821
    },
    "0.32724637": {
      "timeElapsedSinceStart": 45.60000000001945,
      "trackPct": 0.32756873965263367
    },
    "0.32776416": {
      "timeElapsedSinceStart": 45.63333333335281,
      "trackPct": 0.32778438925743103
    },
    "0.32828196": {
      "timeElapsedSinceStart": 45.73333333335289,
      "trackPct": 0.3284166157245636
    },
    "0.32879975": {
      "timeElapsedSinceStart": 45.83333333335297,
      "trackPct": 0.3290258049964905
    },
    "0.32931755": {
      "timeElapsedSinceStart": 45.91666666668637,
      "trackPct": 0.32951584458351135
    },
    "0.32983534": {
      "timeElapsedSinceStart": 46.01666666668645,
      "trackPct": 0.3300832509994507
    },
    "0.33035314": {
      "timeElapsedSinceStart": 46.06666666668649,
      "trackPct": 0.33035850524902344
    },
    "0.33087093": {
      "timeElapsedSinceStart": 46.20000000001993,
      "trackPct": 0.3310651481151581
    },
    "0.33138873": {
      "timeElapsedSinceStart": 46.300000000020006,
      "trackPct": 0.3315693140029907
    },
    "0.33190652": {
      "timeElapsedSinceStart": 46.383333333353406,
      "trackPct": 0.3319724202156067
    },
    "0.33242432": {
      "timeElapsedSinceStart": 46.483333333353485,
      "trackPct": 0.33243608474731445
    },
    "0.33294211": {
      "timeElapsedSinceStart": 46.616666666686925,
      "trackPct": 0.3330213129520416
    },
    "0.33345991": {
      "timeElapsedSinceStart": 46.766666666687044,
      "trackPct": 0.3336384892463684
    },
    "0.3339777": {
      "timeElapsedSinceStart": 46.90000000002048,
      "trackPct": 0.3341510593891144
    },
    "0.3344955": {
      "timeElapsedSinceStart": 47.00000000002056,
      "trackPct": 0.3345184326171875
    },
    "0.33501329": {
      "timeElapsedSinceStart": 47.18333333335404,
      "trackPct": 0.33515793085098267
    },
    "0.33553108": {
      "timeElapsedSinceStart": 47.31666666668748,
      "trackPct": 0.33560284972190857
    },
    "0.33604888": {
      "timeElapsedSinceStart": 47.4666666666876,
      "trackPct": 0.33609434962272644
    },
    "0.33656667": {
      "timeElapsedSinceStart": 47.65000000002108,
      "trackPct": 0.33670079708099365
    },
    "0.33708447": {
      "timeElapsedSinceStart": 47.78333333335452,
      "trackPct": 0.33714431524276733
    },
    "0.33760226": {
      "timeElapsedSinceStart": 47.93333333335464,
      "trackPct": 0.3376486301422119
    },
    "0.33812006": {
      "timeElapsedSinceStart": 48.11666666668812,
      "trackPct": 0.3382793962955475
    },
    "0.33863785": {
      "timeElapsedSinceStart": 48.25000000002156,
      "trackPct": 0.33874762058258057
    },
    "0.33915565": {
      "timeElapsedSinceStart": 48.40000000002168,
      "trackPct": 0.33928295969963074
    },
    "0.33967344": {
      "timeElapsedSinceStart": 48.53333333335512,
      "trackPct": 0.3397679924964905
    },
    "0.34019124": {
      "timeElapsedSinceStart": 48.683333333355236,
      "trackPct": 0.34029892086982727
    },
    "0.34070903": {
      "timeElapsedSinceStart": 48.816666666688675,
      "trackPct": 0.3407481908798218
    },
    "0.34122683": {
      "timeElapsedSinceStart": 49.000000000022155,
      "trackPct": 0.34134823083877563
    },
    "0.34174462": {
      "timeElapsedSinceStart": 49.150000000022274,
      "trackPct": 0.34183475375175476
    },
    "0.34226242": {
      "timeElapsedSinceStart": 49.28333333335571,
      "trackPct": 0.3422664999961853
    },
    "0.34278021": {
      "timeElapsedSinceStart": 49.46666666668919,
      "trackPct": 0.3428517282009125
    },
    "0.34329801": {
      "timeElapsedSinceStart": 49.65000000002267,
      "trackPct": 0.34342488646507263
    },
    "0.3438158": {
      "timeElapsedSinceStart": 49.80000000002279,
      "trackPct": 0.3438946306705475
    },
    "0.3443336": {
      "timeElapsedSinceStart": 49.98333333335627,
      "trackPct": 0.3444802761077881
    },
    "0.34485139": {
      "timeElapsedSinceStart": 50.11666666668971,
      "trackPct": 0.3449217677116394
    },
    "0.34536919": {
      "timeElapsedSinceStart": 50.26666666668983,
      "trackPct": 0.34544017910957336
    },
    "0.34588698": {
      "timeElapsedSinceStart": 50.40000000002327,
      "trackPct": 0.3459267318248749
    },
    "0.34640478": {
      "timeElapsedSinceStart": 50.53333333335671,
      "trackPct": 0.34643736481666565
    },
    "0.34692257": {
      "timeElapsedSinceStart": 50.68333333335683,
      "trackPct": 0.34704095125198364
    },
    "0.34744037": {
      "timeElapsedSinceStart": 50.81666666669027,
      "trackPct": 0.3476037383079529
    },
    "0.34795816": {
      "timeElapsedSinceStart": 50.91666666669035,
      "trackPct": 0.3480418920516968
    },
    "0.34847596": {
      "timeElapsedSinceStart": 51.050000000023786,
      "trackPct": 0.3486466109752655
    },
    "0.34899375": {
      "timeElapsedSinceStart": 51.150000000023866,
      "trackPct": 0.34911048412323
    },
    "0.34951155": {
      "timeElapsedSinceStart": 51.283333333357305,
      "trackPct": 0.3497372269630432
    },
    "0.35002934": {
      "timeElapsedSinceStart": 51.383333333357385,
      "trackPct": 0.3502117395401001
    },
    "0.35054714": {
      "timeElapsedSinceStart": 51.466666666690784,
      "trackPct": 0.3506107032299042
    },
    "0.35106493": {
      "timeElapsedSinceStart": 51.566666666690864,
      "trackPct": 0.35109537839889526
    },
    "0.35158273": {
      "timeElapsedSinceStart": 51.7000000000243,
      "trackPct": 0.35175079107284546
    },
    "0.35210052": {
      "timeElapsedSinceStart": 51.80000000002438,
      "trackPct": 0.3522493839263916
    },
    "0.35261832": {
      "timeElapsedSinceStart": 51.90000000002446,
      "trackPct": 0.3527541756629944
    },
    "0.35313611": {
      "timeElapsedSinceStart": 51.98333333335786,
      "trackPct": 0.35317936539649963
    },
    "0.35365391": {
      "timeElapsedSinceStart": 52.08333333335794,
      "trackPct": 0.35369551181793213
    },
    "0.3541717": {
      "timeElapsedSinceStart": 52.21666666669138,
      "trackPct": 0.35439711809158325
    },
    "0.3546895": {
      "timeElapsedSinceStart": 52.31666666669146,
      "trackPct": 0.3549363613128662
    },
    "0.35520729": {
      "timeElapsedSinceStart": 52.40000000002486,
      "trackPct": 0.3553944528102875
    },
    "0.35572509": {
      "timeElapsedSinceStart": 52.50000000002494,
      "trackPct": 0.3559541702270508
    },
    "0.35624288": {
      "timeElapsedSinceStart": 52.58333333335834,
      "trackPct": 0.35642942786216736
    },
    "0.35676068": {
      "timeElapsedSinceStart": 52.68333333335842,
      "trackPct": 0.3570089042186737
    },
    "0.35727847": {
      "timeElapsedSinceStart": 52.73333333335846,
      "trackPct": 0.35730260610580444
    },
    "0.35779626": {
      "timeElapsedSinceStart": 52.81666666669186,
      "trackPct": 0.3577982783317566
    },
    "0.35831406": {
      "timeElapsedSinceStart": 52.91666666669194,
      "trackPct": 0.358401894569397
    },
    "0.35883185": {
      "timeElapsedSinceStart": 53.01666666669202,
      "trackPct": 0.35901549458503723
    },
    "0.35934965": {
      "timeElapsedSinceStart": 53.10000000002542,
      "trackPct": 0.35953405499458313
    },
    "0.35986744": {
      "timeElapsedSinceStart": 53.2000000000255,
      "trackPct": 0.36016517877578735
    },
    "0.36038524": {
      "timeElapsedSinceStart": 53.2833333333589,
      "trackPct": 0.36069828271865845
    },
    "0.36090303": {
      "timeElapsedSinceStart": 53.33333333335894,
      "trackPct": 0.3610211908817291
    },
    "0.36142083": {
      "timeElapsedSinceStart": 53.433333333359016,
      "trackPct": 0.3616744875907898
    },
    "0.36193862": {
      "timeElapsedSinceStart": 53.516666666692416,
      "trackPct": 0.3622256815433502
    },
    "0.36245642": {
      "timeElapsedSinceStart": 53.566666666692456,
      "trackPct": 0.36255866289138794
    },
    "0.36297421": {
      "timeElapsedSinceStart": 53.666666666692535,
      "trackPct": 0.363231360912323
    },
    "0.36349201": {
      "timeElapsedSinceStart": 53.750000000025935,
      "trackPct": 0.36379730701446533
    },
    "0.3640098": {
      "timeElapsedSinceStart": 53.800000000025975,
      "trackPct": 0.3641374707221985
    },
    "0.3645276": {
      "timeElapsedSinceStart": 53.900000000026054,
      "trackPct": 0.36482444405555725
    },
    "0.36504539": {
      "timeElapsedSinceStart": 53.933333333359414,
      "trackPct": 0.36505505442619324
    },
    "0.36556319": {
      "timeElapsedSinceStart": 54.033333333359494,
      "trackPct": 0.3657521605491638
    },
    "0.36608098": {
      "timeElapsedSinceStart": 54.08333333335953,
      "trackPct": 0.36610376834869385
    },
    "0.36659878": {
      "timeElapsedSinceStart": 54.16666666669293,
      "trackPct": 0.36669421195983887
    },
    "0.36711657": {
      "timeElapsedSinceStart": 54.26666666669301,
      "trackPct": 0.36741018295288086
    },
    "0.36763437": {
      "timeElapsedSinceStart": 54.31666666669305,
      "trackPct": 0.36777135729789734
    },
    "0.36815216": {
      "timeElapsedSinceStart": 54.40000000002645,
      "trackPct": 0.36837807297706604
    },
    "0.36866996": {
      "timeElapsedSinceStart": 54.45000000002649,
      "trackPct": 0.368744820356369
    },
    "0.36918775": {
      "timeElapsedSinceStart": 54.55000000002657,
      "trackPct": 0.3694835901260376
    },
    "0.36970555": {
      "timeElapsedSinceStart": 54.60000000002661,
      "trackPct": 0.36985570192337036
    },
    "0.37022334": {
      "timeElapsedSinceStart": 54.68333333336001,
      "trackPct": 0.370479941368103
    },
    "0.37074114": {
      "timeElapsedSinceStart": 54.73333333336005,
      "trackPct": 0.37085700035095215
    },
    "0.37125893": {
      "timeElapsedSinceStart": 54.83333333336013,
      "trackPct": 0.3716167211532593
    },
    "0.37177673": {
      "timeElapsedSinceStart": 54.86666666669349,
      "trackPct": 0.37187162041664124
    },
    "0.37229452": {
      "timeElapsedSinceStart": 54.96666666669357,
      "trackPct": 0.3726414144039154
    },
    "0.37281232": {
      "timeElapsedSinceStart": 55.01666666669361,
      "trackPct": 0.3730292022228241
    },
    "0.37333011": {
      "timeElapsedSinceStart": 55.10000000002701,
      "trackPct": 0.3736797869205475
    },
    "0.37384791": {
      "timeElapsedSinceStart": 55.15000000002705,
      "trackPct": 0.37407273054122925
    },
    "0.3743657": {
      "timeElapsedSinceStart": 55.20000000002709,
      "trackPct": 0.3744675815105438
    },
    "0.3748835": {
      "timeElapsedSinceStart": 55.30000000002717,
      "trackPct": 0.3752632737159729
    },
    "0.37540129": {
      "timeElapsedSinceStart": 55.33333333336053,
      "trackPct": 0.37553027272224426
    },
    "0.37591909": {
      "timeElapsedSinceStart": 55.38333333336057,
      "trackPct": 0.37593233585357666
    },
    "0.37643688": {
      "timeElapsedSinceStart": 55.48333333336065,
      "trackPct": 0.3767426609992981
    },
    "0.37695468": {
      "timeElapsedSinceStart": 55.53333333336069,
      "trackPct": 0.37715044617652893
    },
    "0.37747247": {
      "timeElapsedSinceStart": 55.61666666669409,
      "trackPct": 0.37783339619636536
    },
    "0.37799027": {
      "timeElapsedSinceStart": 55.66666666669413,
      "trackPct": 0.37824511528015137
    },
    "0.37850806": {
      "timeElapsedSinceStart": 55.71666666669417,
      "trackPct": 0.3786582946777344
    },
    "0.37902586": {
      "timeElapsedSinceStart": 55.800000000027566,
      "trackPct": 0.3793502151966095
    },
    "0.37954365": {
      "timeElapsedSinceStart": 55.850000000027606,
      "trackPct": 0.3797673285007477
    },
    "0.38006144": {
      "timeElapsedSinceStart": 55.900000000027646,
      "trackPct": 0.38018590211868286
    },
    "0.38057924": {
      "timeElapsedSinceStart": 55.950000000027686,
      "trackPct": 0.3806059956550598
    },
    "0.38109703": {
      "timeElapsedSinceStart": 56.033333333361085,
      "trackPct": 0.38130927085876465
    },
    "0.38161483": {
      "timeElapsedSinceStart": 56.083333333361125,
      "trackPct": 0.3817330598831177
    },
    "0.38213262": {
      "timeElapsedSinceStart": 56.133333333361165,
      "trackPct": 0.3821583390235901
    },
    "0.38265042": {
      "timeElapsedSinceStart": 56.233333333361244,
      "trackPct": 0.3830134868621826
    },
    "0.38316821": {
      "timeElapsedSinceStart": 56.266666666694604,
      "trackPct": 0.3832995593547821
    },
    "0.38368601": {
      "timeElapsedSinceStart": 56.316666666694644,
      "trackPct": 0.38372960686683655
    },
    "0.3842038": {
      "timeElapsedSinceStart": 56.416666666694724,
      "trackPct": 0.38459333777427673
    },
    "0.3847216": {
      "timeElapsedSinceStart": 56.45000000002808,
      "trackPct": 0.3848821222782135
    },
    "0.38523939": {
      "timeElapsedSinceStart": 56.50000000002812,
      "trackPct": 0.3853161931037903
    },
    "0.38575719": {
      "timeElapsedSinceStart": 56.6000000000282,
      "trackPct": 0.3861861824989319
    },
    "0.38627498": {
      "timeElapsedSinceStart": 56.65000000002824,
      "trackPct": 0.3866216838359833
    },
    "0.38679278": {
      "timeElapsedSinceStart": 56.6833333333616,
      "trackPct": 0.3869127333164215
    },
    "0.38731057": {
      "timeElapsedSinceStart": 56.73333333336164,
      "trackPct": 0.38735026121139526
    },
    "0.38782837": {
      "timeElapsedSinceStart": 56.83333333336172,
      "trackPct": 0.38822880387306213
    },
    "0.38834616": {
      "timeElapsedSinceStart": 56.88333333336176,
      "trackPct": 0.3886699676513672
    },
    "0.38886396": {
      "timeElapsedSinceStart": 56.91666666669512,
      "trackPct": 0.3889647126197815
    },
    "0.38938175": {
      "timeElapsedSinceStart": 56.96666666669516,
      "trackPct": 0.3894079923629761
    },
    "0.38989955": {
      "timeElapsedSinceStart": 57.06666666669524,
      "trackPct": 0.39029833674430847
    },
    "0.39041734": {
      "timeElapsedSinceStart": 57.11666666669528,
      "trackPct": 0.3907455503940582
    },
    "0.39093514": {
      "timeElapsedSinceStart": 57.15000000002864,
      "trackPct": 0.3910444676876068
    },
    "0.39145293": {
      "timeElapsedSinceStart": 57.20000000002868,
      "trackPct": 0.3914940655231476
    },
    "0.39197073": {
      "timeElapsedSinceStart": 57.30000000002876,
      "trackPct": 0.39239785075187683
    },
    "0.39248852": {
      "timeElapsedSinceStart": 57.3500000000288,
      "trackPct": 0.3928515613079071
    },
    "0.39300632": {
      "timeElapsedSinceStart": 57.40000000002884,
      "trackPct": 0.39330655336380005
    },
    "0.39352411": {
      "timeElapsedSinceStart": 57.4333333333622,
      "trackPct": 0.3936106264591217
    },
    "0.39404191": {
      "timeElapsedSinceStart": 57.48333333336224,
      "trackPct": 0.3940679728984833
    },
    "0.3945597": {
      "timeElapsedSinceStart": 57.58333333336232,
      "trackPct": 0.3949868083000183
    },
    "0.3950775": {
      "timeElapsedSinceStart": 57.61666666669568,
      "trackPct": 0.39529430866241455
    },
    "0.39559529": {
      "timeElapsedSinceStart": 57.66666666669572,
      "trackPct": 0.3957567811012268
    },
    "0.39611309": {
      "timeElapsedSinceStart": 57.71666666669576,
      "trackPct": 0.39622068405151367
    },
    "0.39663088": {
      "timeElapsedSinceStart": 57.7666666666958,
      "trackPct": 0.39668598771095276
    },
    "0.39714868": {
      "timeElapsedSinceStart": 57.81666666669584,
      "trackPct": 0.39715269207954407
    },
    "0.39766647": {
      "timeElapsedSinceStart": 57.90000000002924,
      "trackPct": 0.39793363213539124
    },
    "0.39818427": {
      "timeElapsedSinceStart": 57.95000000002928,
      "trackPct": 0.398404061794281
    },
    "0.39870206": {
      "timeElapsedSinceStart": 58.00000000002932,
      "trackPct": 0.3988759219646454
    },
    "0.39921986": {
      "timeElapsedSinceStart": 58.05000000002936,
      "trackPct": 0.399349182844162
    },
    "0.39973765": {
      "timeElapsedSinceStart": 58.133333333362756,
      "trackPct": 0.40014106035232544
    },
    "0.40025545": {
      "timeElapsedSinceStart": 58.183333333362796,
      "trackPct": 0.4006181061267853
    },
    "0.40077324": {
      "timeElapsedSinceStart": 58.233333333362836,
      "trackPct": 0.4010966420173645
    },
    "0.40129104": {
      "timeElapsedSinceStart": 58.283333333362876,
      "trackPct": 0.4015771150588989
    },
    "0.40180883": {
      "timeElapsedSinceStart": 58.316666666696236,
      "trackPct": 0.4018983840942383
    },
    "0.40232663": {
      "timeElapsedSinceStart": 58.366666666696275,
      "trackPct": 0.40238118171691895
    },
    "0.40284442": {
      "timeElapsedSinceStart": 58.416666666696315,
      "trackPct": 0.4028652310371399
    },
    "0.40336221": {
      "timeElapsedSinceStart": 58.516666666696395,
      "trackPct": 0.4038368761539459
    },
    "0.40388001": {
      "timeElapsedSinceStart": 58.550000000029755,
      "trackPct": 0.4041617512702942
    },
    "0.4043978": {
      "timeElapsedSinceStart": 58.600000000029794,
      "trackPct": 0.4046500623226166
    },
    "0.4049156": {
      "timeElapsedSinceStart": 58.650000000029834,
      "trackPct": 0.4051395058631897
    },
    "0.40543339": {
      "timeElapsedSinceStart": 58.700000000029874,
      "trackPct": 0.40563005208969116
    },
    "0.40595119": {
      "timeElapsedSinceStart": 58.750000000029914,
      "trackPct": 0.4061216711997986
    },
    "0.40646898": {
      "timeElapsedSinceStart": 58.83333333336331,
      "trackPct": 0.40694352984428406
    },
    "0.40698678": {
      "timeElapsedSinceStart": 58.88333333336335,
      "trackPct": 0.40743812918663025
    },
    "0.40750457": {
      "timeElapsedSinceStart": 58.93333333336339,
      "trackPct": 0.40793371200561523
    },
    "0.40802237": {
      "timeElapsedSinceStart": 58.98333333336343,
      "trackPct": 0.4084304869174957
    },
    "0.40854016": {
      "timeElapsedSinceStart": 59.01666666669679,
      "trackPct": 0.40876227617263794
    },
    "0.40905796": {
      "timeElapsedSinceStart": 59.06666666669683,
      "trackPct": 0.4092608392238617
    },
    "0.40957575": {
      "timeElapsedSinceStart": 59.11666666669687,
      "trackPct": 0.4097604751586914
    },
    "0.41009355": {
      "timeElapsedSinceStart": 59.16666666669691,
      "trackPct": 0.41026103496551514
    },
    "0.41061134": {
      "timeElapsedSinceStart": 59.25000000003031,
      "trackPct": 0.4110969007015228
    },
    "0.41112914": {
      "timeElapsedSinceStart": 59.30000000003035,
      "trackPct": 0.41159942746162415
    },
    "0.41164693": {
      "timeElapsedSinceStart": 59.35000000003039,
      "trackPct": 0.4121027886867523
    },
    "0.41216473": {
      "timeElapsedSinceStart": 59.40000000003043,
      "trackPct": 0.41260701417922974
    },
    "0.41268252": {
      "timeElapsedSinceStart": 59.45000000003047,
      "trackPct": 0.41311216354370117
    },
    "0.41320032": {
      "timeElapsedSinceStart": 59.48333333336383,
      "trackPct": 0.4134494364261627
    },
    "0.41371811": {
      "timeElapsedSinceStart": 59.53333333336387,
      "trackPct": 0.4139561355113983
    },
    "0.41423591": {
      "timeElapsedSinceStart": 59.58333333336391,
      "trackPct": 0.41446372866630554
    },
    "0.4147537": {
      "timeElapsedSinceStart": 59.63333333336395,
      "trackPct": 0.4149722158908844
    },
    "0.4152715": {
      "timeElapsedSinceStart": 59.68333333336399,
      "trackPct": 0.41548165678977966
    },
    "0.41578929": {
      "timeElapsedSinceStart": 59.71666666669735,
      "trackPct": 0.4158218502998352
    },
    "0.41630709": {
      "timeElapsedSinceStart": 59.76666666669739,
      "trackPct": 0.4163329005241394
    },
    "0.41682488": {
      "timeElapsedSinceStart": 59.81666666669743,
      "trackPct": 0.41684490442276
    },
    "0.41734268": {
      "timeElapsedSinceStart": 59.86666666669747,
      "trackPct": 0.41735783219337463
    },
    "0.41786047": {
      "timeElapsedSinceStart": 59.91666666669751,
      "trackPct": 0.4178716838359833
    },
    "0.41837827": {
      "timeElapsedSinceStart": 60.00000000003091,
      "trackPct": 0.41873013973236084
    },
    "0.41889606": {
      "timeElapsedSinceStart": 60.05000000003095,
      "trackPct": 0.4192464053630829
    },
    "0.41941386": {
      "timeElapsedSinceStart": 60.10000000003099,
      "trackPct": 0.41976359486579895
    },
    "0.41993165": {
      "timeElapsedSinceStart": 60.15000000003103,
      "trackPct": 0.4202815592288971
    },
    "0.42044945": {
      "timeElapsedSinceStart": 60.18333333336439,
      "trackPct": 0.42062726616859436
    },
    "0.42096724": {
      "timeElapsedSinceStart": 60.23333333336443,
      "trackPct": 0.42114636301994324
    },
    "0.42148504": {
      "timeElapsedSinceStart": 60.28333333336447,
      "trackPct": 0.42166614532470703
    },
    "0.42200283": {
      "timeElapsedSinceStart": 60.33333333336451,
      "trackPct": 0.422186017036438
    },
    "0.42252063": {
      "timeElapsedSinceStart": 60.36666666669787,
      "trackPct": 0.42253220081329346
    },
    "0.42303842": {
      "timeElapsedSinceStart": 60.41666666669791,
      "trackPct": 0.4230523407459259
    },
    "0.42355622": {
      "timeElapsedSinceStart": 60.46666666669795,
      "trackPct": 0.4235731065273285
    },
    "0.42407401": {
      "timeElapsedSinceStart": 60.516666666697986,
      "trackPct": 0.4240947663784027
    },
    "0.42459181": {
      "timeElapsedSinceStart": 60.566666666698026,
      "trackPct": 0.424617201089859
    },
    "0.4251096": {
      "timeElapsedSinceStart": 60.650000000031426,
      "trackPct": 0.42548978328704834
    },
    "0.42562739": {
      "timeElapsedSinceStart": 60.700000000031466,
      "trackPct": 0.4260145425796509
    },
    "0.42614519": {
      "timeElapsedSinceStart": 60.750000000031505,
      "trackPct": 0.42654019594192505
    },
    "0.42666298": {
      "timeElapsedSinceStart": 60.800000000031545,
      "trackPct": 0.42706671357154846
    },
    "0.42718078": {
      "timeElapsedSinceStart": 60.850000000031585,
      "trackPct": 0.4275941252708435
    },
    "0.42769857": {
      "timeElapsedSinceStart": 60.883333333364945,
      "trackPct": 0.4279462695121765
    },
    "0.42821637": {
      "timeElapsedSinceStart": 60.933333333364985,
      "trackPct": 0.4284752309322357
    },
    "0.42873416": {
      "timeElapsedSinceStart": 60.983333333365024,
      "trackPct": 0.4290051758289337
    },
    "0.42925196": {
      "timeElapsedSinceStart": 61.033333333365064,
      "trackPct": 0.42953598499298096
    },
    "0.42976975": {
      "timeElapsedSinceStart": 61.083333333365104,
      "trackPct": 0.43006765842437744
    },
    "0.43028755": {
      "timeElapsedSinceStart": 61.116666666698464,
      "trackPct": 0.43042248487472534
    },
    "0.43080534": {
      "timeElapsedSinceStart": 61.166666666698504,
      "trackPct": 0.4309554696083069
    },
    "0.43132314": {
      "timeElapsedSinceStart": 61.21666666669854,
      "trackPct": 0.4314892292022705
    },
    "0.43184093": {
      "timeElapsedSinceStart": 61.26666666669858,
      "trackPct": 0.4320238530635834
    },
    "0.43235873": {
      "timeElapsedSinceStart": 61.31666666669862,
      "trackPct": 0.4325593113899231
    },
    "0.43287652": {
      "timeElapsedSinceStart": 61.35000000003198,
      "trackPct": 0.43291667103767395
    },
    "0.43339432": {
      "timeElapsedSinceStart": 61.40000000003202,
      "trackPct": 0.4334535002708435
    },
    "0.43391211": {
      "timeElapsedSinceStart": 61.45000000003206,
      "trackPct": 0.433991014957428
    },
    "0.43442991": {
      "timeElapsedSinceStart": 61.5000000000321,
      "trackPct": 0.4345293343067169
    },
    "0.4349477": {
      "timeElapsedSinceStart": 61.55000000003214,
      "trackPct": 0.43506839871406555
    },
    "0.4354655": {
      "timeElapsedSinceStart": 61.63333333336554,
      "trackPct": 0.4359685182571411
    },
    "0.43650109": {
      "timeElapsedSinceStart": 61.68333333336558,
      "trackPct": 0.43650954961776733
    },
    "0.43701888": {
      "timeElapsedSinceStart": 61.73333333336562,
      "trackPct": 0.43705135583877563
    },
    "0.43753668": {
      "timeElapsedSinceStart": 61.78333333336566,
      "trackPct": 0.437593936920166
    },
    "0.43805447": {
      "timeElapsedSinceStart": 61.86666666669906,
      "trackPct": 0.4384997487068176
    },
    "0.43857227": {
      "timeElapsedSinceStart": 61.9166666666991,
      "trackPct": 0.4390433132648468
    },
    "0.43909006": {
      "timeElapsedSinceStart": 61.96666666669914,
      "trackPct": 0.43958622217178345
    },
    "0.43960786": {
      "timeElapsedSinceStart": 62.0000000000325,
      "trackPct": 0.43994763493537903
    },
    "0.44012565": {
      "timeElapsedSinceStart": 62.05000000003254,
      "trackPct": 0.4404888153076172
    },
    "0.44064345": {
      "timeElapsedSinceStart": 62.10000000003258,
      "trackPct": 0.44102832674980164
    },
    "0.44116124": {
      "timeElapsedSinceStart": 62.15000000003262,
      "trackPct": 0.4415667653083801
    },
    "0.44167904": {
      "timeElapsedSinceStart": 62.20000000003266,
      "trackPct": 0.4421038329601288
    },
    "0.44219683": {
      "timeElapsedSinceStart": 62.23333333336602,
      "trackPct": 0.4424612522125244
    },
    "0.44271463": {
      "timeElapsedSinceStart": 62.28333333336606,
      "trackPct": 0.4429962933063507
    },
    "0.44323242": {
      "timeElapsedSinceStart": 62.3333333333661,
      "trackPct": 0.4435300827026367
    },
    "0.44375022": {
      "timeElapsedSinceStart": 62.38333333336614,
      "trackPct": 0.4440626800060272
    },
    "0.44426801": {
      "timeElapsedSinceStart": 62.43333333336618,
      "trackPct": 0.4445940852165222
    },
    "0.44478581": {
      "timeElapsedSinceStart": 62.46666666669954,
      "trackPct": 0.44494763016700745
    },
    "0.4453036": {
      "timeElapsedSinceStart": 62.51666666669958,
      "trackPct": 0.4454770088195801
    },
    "0.4458214": {
      "timeElapsedSinceStart": 62.56666666669962,
      "trackPct": 0.4460051953792572
    },
    "0.44633919": {
      "timeElapsedSinceStart": 62.61666666669966,
      "trackPct": 0.44653216004371643
    },
    "0.44685699": {
      "timeElapsedSinceStart": 62.6666666666997,
      "trackPct": 0.44705790281295776
    },
    "0.44737478": {
      "timeElapsedSinceStart": 62.70000000003306,
      "trackPct": 0.44740769267082214
    },
    "0.44789257": {
      "timeElapsedSinceStart": 62.7500000000331,
      "trackPct": 0.4479310214519501
    },
    "0.44841037": {
      "timeElapsedSinceStart": 62.80000000003314,
      "trackPct": 0.448452353477478
    },
    "0.44892816": {
      "timeElapsedSinceStart": 62.85000000003318,
      "trackPct": 0.448971152305603
    },
    "0.44944596": {
      "timeElapsedSinceStart": 62.90000000003322,
      "trackPct": 0.44948694109916687
    },
    "0.44996375": {
      "timeElapsedSinceStart": 62.983333333366616,
      "trackPct": 0.4503394365310669
    },
    "0.45048155": {
      "timeElapsedSinceStart": 63.033333333366656,
      "trackPct": 0.4508454501628876
    },
    "0.45099934": {
      "timeElapsedSinceStart": 63.083333333366696,
      "trackPct": 0.45134687423706055
    },
    "0.45151714": {
      "timeElapsedSinceStart": 63.116666666700056,
      "trackPct": 0.4516785740852356
    },
    "0.45203493": {
      "timeElapsedSinceStart": 63.166666666700095,
      "trackPct": 0.4521718919277191
    },
    "0.45255273": {
      "timeElapsedSinceStart": 63.216666666700135,
      "trackPct": 0.45266014337539673
    },
    "0.45307052": {
      "timeElapsedSinceStart": 63.266666666700175,
      "trackPct": 0.4531431794166565
    },
    "0.45358832": {
      "timeElapsedSinceStart": 63.316666666700215,
      "trackPct": 0.4536210298538208
    },
    "0.45410611": {
      "timeElapsedSinceStart": 63.400000000033614,
      "trackPct": 0.45440590381622314
    },
    "0.45462391": {
      "timeElapsedSinceStart": 63.450000000033654,
      "trackPct": 0.4548698365688324
    },
    "0.4551417": {
      "timeElapsedSinceStart": 63.500000000033694,
      "trackPct": 0.45532843470573425
    },
    "0.4556595": {
      "timeElapsedSinceStart": 63.550000000033734,
      "trackPct": 0.4557817280292511
    },
    "0.45617729": {
      "timeElapsedSinceStart": 63.63333333336713,
      "trackPct": 0.456525593996048
    },
    "0.45669509": {
      "timeElapsedSinceStart": 63.68333333336717,
      "trackPct": 0.4569655954837799
    },
    "0.45721288": {
      "timeElapsedSinceStart": 63.73333333336721,
      "trackPct": 0.45740023255348206
    },
    "0.45773068": {
      "timeElapsedSinceStart": 63.78333333336725,
      "trackPct": 0.45782893896102905
    },
    "0.45824847": {
      "timeElapsedSinceStart": 63.86666666670065,
      "trackPct": 0.45853182673454285
    },
    "0.45876627": {
      "timeElapsedSinceStart": 63.91666666670069,
      "trackPct": 0.45894646644592285
    },
    "0.45928406": {
      "timeElapsedSinceStart": 63.96666666670073,
      "trackPct": 0.4593559503555298
    },
    "0.45980186": {
      "timeElapsedSinceStart": 64.05000000003413,
      "trackPct": 0.4600277245044708
    },
    "0.46031965": {
      "timeElapsedSinceStart": 64.10000000003417,
      "trackPct": 0.4604250490665436
    },
    "0.46083745": {
      "timeElapsedSinceStart": 64.20000000003425,
      "trackPct": 0.4612047076225281
    },
    "0.46135524": {
      "timeElapsedSinceStart": 64.23333333336761,
      "trackPct": 0.46145984530448914
    },
    "0.46187304": {
      "timeElapsedSinceStart": 64.33333333336769,
      "trackPct": 0.4622117877006531
    },
    "0.46239083": {
      "timeElapsedSinceStart": 64.38333333336773,
      "trackPct": 0.46258002519607544
    },
    "0.46290863": {
      "timeElapsedSinceStart": 64.43333333336777,
      "trackPct": 0.4629431664943695
    },
    "0.46342642": {
      "timeElapsedSinceStart": 64.51666666670117,
      "trackPct": 0.4635371267795563
    },
    "0.46394422": {
      "timeElapsedSinceStart": 64.61666666670125,
      "trackPct": 0.4642312228679657
    },
    "0.46446201": {
      "timeElapsedSinceStart": 64.66666666670129,
      "trackPct": 0.46457070112228394
    },
    "0.46497981": {
      "timeElapsedSinceStart": 64.75000000003469,
      "trackPct": 0.4651253819465637
    },
    "0.4654976": {
      "timeElapsedSinceStart": 64.85000000003477,
      "trackPct": 0.46577170491218567
    },
    "0.4660154": {
      "timeElapsedSinceStart": 64.90000000003481,
      "trackPct": 0.46608656644821167
    },
    "0.46653319": {
      "timeElapsedSinceStart": 64.98333333336821,
      "trackPct": 0.4666004478931427
    },
    "0.46705099": {
      "timeElapsedSinceStart": 65.08333333336829,
      "trackPct": 0.46720293164253235
    },
    "0.46756878": {
      "timeElapsedSinceStart": 65.16666666670169,
      "trackPct": 0.4676940143108368
    },
    "0.46808658": {
      "timeElapsedSinceStart": 65.26666666670177,
      "trackPct": 0.4682668447494507
    },
    "0.46860437": {
      "timeElapsedSinceStart": 65.35000000003517,
      "trackPct": 0.46873003244400024
    },
    "0.46912217": {
      "timeElapsedSinceStart": 65.45000000003525,
      "trackPct": 0.46926766633987427
    },
    "0.46963996": {
      "timeElapsedSinceStart": 65.55000000003533,
      "trackPct": 0.4697835445404053
    },
    "0.47015775": {
      "timeElapsedSinceStart": 65.63333333336872,
      "trackPct": 0.4701959490776062
    },
    "0.47067555": {
      "timeElapsedSinceStart": 65.78333333336884,
      "trackPct": 0.4709024429321289
    },
    "0.47119334": {
      "timeElapsedSinceStart": 65.86666666670224,
      "trackPct": 0.47127071022987366
    },
    "0.47171114": {
      "timeElapsedSinceStart": 66.01666666670236,
      "trackPct": 0.47188693284988403
    },
    "0.47222893": {
      "timeElapsedSinceStart": 66.1500000000358,
      "trackPct": 0.47239479422569275
    },
    "0.47274673": {
      "timeElapsedSinceStart": 66.25000000003588,
      "trackPct": 0.4727571904659271
    },
    "0.47326452": {
      "timeElapsedSinceStart": 66.43333333336936,
      "trackPct": 0.47339507937431335
    },
    "0.47378232": {
      "timeElapsedSinceStart": 66.5666666667028,
      "trackPct": 0.47384628653526306
    },
    "0.47430011": {
      "timeElapsedSinceStart": 66.75000000003628,
      "trackPct": 0.47446122765541077
    },
    "0.47481791": {
      "timeElapsedSinceStart": 66.9000000000364,
      "trackPct": 0.4749614894390106
    },
    "0.4753357": {
      "timeElapsedSinceStart": 67.03333333336984,
      "trackPct": 0.47540226578712463
    },
    "0.4758535": {
      "timeElapsedSinceStart": 67.18333333336996,
      "trackPct": 0.4758967459201813
    },
    "0.47637129": {
      "timeElapsedSinceStart": 67.36666666670344,
      "trackPct": 0.4765041470527649
    },
    "0.47688909": {
      "timeElapsedSinceStart": 67.50000000003688,
      "trackPct": 0.47695085406303406
    },
    "0.47740688": {
      "timeElapsedSinceStart": 67.68333333337036,
      "trackPct": 0.47758081555366516
    },
    "0.47792468": {
      "timeElapsedSinceStart": 67.78333333337044,
      "trackPct": 0.4779345691204071
    },
    "0.47844247": {
      "timeElapsedSinceStart": 67.96666666670392,
      "trackPct": 0.47860631346702576
    },
    "0.47896027": {
      "timeElapsedSinceStart": 68.10000000003735,
      "trackPct": 0.47911086678504944
    },
    "0.47947806": {
      "timeElapsedSinceStart": 68.20000000003743,
      "trackPct": 0.4795033633708954
    },
    "0.47999586": {
      "timeElapsedSinceStart": 68.33333333337087,
      "trackPct": 0.48005053400993347
    },
    "0.48051365": {
      "timeElapsedSinceStart": 68.483333333371,
      "trackPct": 0.4807005524635315
    },
    "0.48103145": {
      "timeElapsedSinceStart": 68.56666666670439,
      "trackPct": 0.48107486963272095
    },
    "0.48154924": {
      "timeElapsedSinceStart": 68.71666666670451,
      "trackPct": 0.4817717969417572
    },
    "0.48206704": {
      "timeElapsedSinceStart": 68.80000000003791,
      "trackPct": 0.48217472434043884
    },
    "0.48258483": {
      "timeElapsedSinceStart": 68.90000000003799,
      "trackPct": 0.4826717972755432
    },
    "0.48310263": {
      "timeElapsedSinceStart": 69.03333333337143,
      "trackPct": 0.4833557903766632
    },
    "0.48362042": {
      "timeElapsedSinceStart": 69.13333333337151,
      "trackPct": 0.48387446999549866
    },
    "0.48413822": {
      "timeElapsedSinceStart": 69.21666666670491,
      "trackPct": 0.4843129813671112
    },
    "0.48465601": {
      "timeElapsedSinceStart": 69.31666666670499,
      "trackPct": 0.4848475456237793
    },
    "0.48517381": {
      "timeElapsedSinceStart": 69.41666666670507,
      "trackPct": 0.48539063334465027
    },
    "0.4856916": {
      "timeElapsedSinceStart": 69.50000000003847,
      "trackPct": 0.4858494699001312
    },
    "0.4862094": {
      "timeElapsedSinceStart": 69.60000000003855,
      "trackPct": 0.4864046573638916
    },
    "0.48672719": {
      "timeElapsedSinceStart": 69.68333333337195,
      "trackPct": 0.48687058687210083
    },
    "0.48724499": {
      "timeElapsedSinceStart": 69.78333333337203,
      "trackPct": 0.48743271827697754
    },
    "0.48776278": {
      "timeElapsedSinceStart": 69.86666666670543,
      "trackPct": 0.4879012405872345
    },
    "0.48828058": {
      "timeElapsedSinceStart": 69.9666666667055,
      "trackPct": 0.4884603023529053
    },
    "0.48879837": {
      "timeElapsedSinceStart": 70.06666666670559,
      "trackPct": 0.4890230894088745
    },
    "0.48931617": {
      "timeElapsedSinceStart": 70.15000000003899,
      "trackPct": 0.4894954264163971
    },
    "0.48983396": {
      "timeElapsedSinceStart": 70.25000000003907,
      "trackPct": 0.4900667071342468
    },
    "0.49035176": {
      "timeElapsedSinceStart": 70.3000000000391,
      "trackPct": 0.49035459756851196
    },
    "0.49086955": {
      "timeElapsedSinceStart": 70.43333333337254,
      "trackPct": 0.491130530834198
    },
    "0.49138735": {
      "timeElapsedSinceStart": 70.48333333337258,
      "trackPct": 0.4914252460002899
    },
    "0.49190514": {
      "timeElapsedSinceStart": 70.56666666670598,
      "trackPct": 0.49192100763320923
    },
    "0.49242293": {
      "timeElapsedSinceStart": 70.66666666670606,
      "trackPct": 0.49252375960350037
    },
    "0.49294073": {
      "timeElapsedSinceStart": 70.76666666670614,
      "trackPct": 0.49313440918922424
    },
    "0.49345852": {
      "timeElapsedSinceStart": 70.85000000003954,
      "trackPct": 0.49364954233169556
    },
    "0.49397632": {
      "timeElapsedSinceStart": 70.95000000003962,
      "trackPct": 0.4942750930786133
    },
    "0.49449411": {
      "timeElapsedSinceStart": 71.00000000003966,
      "trackPct": 0.4945901930332184
    },
    "0.49501191": {
      "timeElapsedSinceStart": 71.08333333337306,
      "trackPct": 0.4951186180114746
    },
    "0.4955297": {
      "timeElapsedSinceStart": 71.18333333337314,
      "trackPct": 0.4957582354545593
    },
    "0.4960475": {
      "timeElapsedSinceStart": 71.23333333337318,
      "trackPct": 0.4960803985595703
    },
    "0.49656529": {
      "timeElapsedSinceStart": 71.31666666670658,
      "trackPct": 0.49662065505981445
    },
    "0.49708309": {
      "timeElapsedSinceStart": 71.41666666670666,
      "trackPct": 0.49727484583854675
    },
    "0.49760088": {
      "timeElapsedSinceStart": 71.4666666667067,
      "trackPct": 0.4976043403148651
    },
    "0.49811868": {
      "timeElapsedSinceStart": 71.5500000000401,
      "trackPct": 0.49815690517425537
    },
    "0.49863647": {
      "timeElapsedSinceStart": 71.65000000004018,
      "trackPct": 0.4988234341144562
    },
    "0.49915427": {
      "timeElapsedSinceStart": 71.70000000004022,
      "trackPct": 0.4991592466831207
    },
    "0.49967206": {
      "timeElapsedSinceStart": 71.78333333337362,
      "trackPct": 0.49972307682037354
    },
    "0.50018986": {
      "timeElapsedSinceStart": 71.8833333333737,
      "trackPct": 0.5004048943519592
    },
    "0.50070765": {
      "timeElapsedSinceStart": 71.93333333337374,
      "trackPct": 0.5007473230361938
    },
    "0.50122545": {
      "timeElapsedSinceStart": 72.01666666670714,
      "trackPct": 0.501320481300354
    },
    "0.50174324": {
      "timeElapsedSinceStart": 72.11666666670722,
      "trackPct": 0.5020126104354858
    },
    "0.50226104": {
      "timeElapsedSinceStart": 72.16666666670726,
      "trackPct": 0.5023606419563293
    },
    "0.50277883": {
      "timeElapsedSinceStart": 72.25000000004066,
      "trackPct": 0.5029438138008118
    },
    "0.50329663": {
      "timeElapsedSinceStart": 72.35000000004074,
      "trackPct": 0.5036494135856628
    },
    "0.50381442": {
      "timeElapsedSinceStart": 72.40000000004078,
      "trackPct": 0.5040048360824585
    },
    "0.50433222": {
      "timeElapsedSinceStart": 72.45000000004082,
      "trackPct": 0.5043621063232422
    },
    "0.50485001": {
      "timeElapsedSinceStart": 72.53333333337422,
      "trackPct": 0.5049617886543274
    },
    "0.50536781": {
      "timeElapsedSinceStart": 72.6333333333743,
      "trackPct": 0.5056886076927185
    },
    "0.5058856": {
      "timeElapsedSinceStart": 72.66666666670766,
      "trackPct": 0.505932629108429
    },
    "0.5064034": {
      "timeElapsedSinceStart": 72.76666666670774,
      "trackPct": 0.5066701769828796
    },
    "0.50692119": {
      "timeElapsedSinceStart": 72.81666666670777,
      "trackPct": 0.5070417523384094
    },
    "0.50743899": {
      "timeElapsedSinceStart": 72.90000000004117,
      "trackPct": 0.5076646208763123
    },
    "0.50795678": {
      "timeElapsedSinceStart": 72.95000000004121,
      "trackPct": 0.5080403685569763
    },
    "0.50847458": {
      "timeElapsedSinceStart": 73.0500000000413,
      "trackPct": 0.5087964534759521
    },
    "0.50899237": {
      "timeElapsedSinceStart": 73.10000000004133,
      "trackPct": 0.5091767907142639
    },
    "0.50951017": {
      "timeElapsedSinceStart": 73.18333333337473,
      "trackPct": 0.5098139643669128
    },
    "0.51002796": {
      "timeElapsedSinceStart": 73.23333333337477,
      "trackPct": 0.5101982951164246
    },
    "0.51054576": {
      "timeElapsedSinceStart": 73.28333333337481,
      "trackPct": 0.51058429479599
    },
    "0.51106355": {
      "timeElapsedSinceStart": 73.38333333337489,
      "trackPct": 0.5113611817359924
    },
    "0.51158135": {
      "timeElapsedSinceStart": 73.41666666670825,
      "trackPct": 0.5116214752197266
    },
    "0.51209914": {
      "timeElapsedSinceStart": 73.51666666670833,
      "trackPct": 0.512407124042511
    },
    "0.51261694": {
      "timeElapsedSinceStart": 73.56666666670837,
      "trackPct": 0.5128024816513062
    },
    "0.51313473": {
      "timeElapsedSinceStart": 73.65000000004177,
      "trackPct": 0.5134654641151428
    },
    "0.51365253": {
      "timeElapsedSinceStart": 73.70000000004181,
      "trackPct": 0.5138657689094543
    },
    "0.51417032": {
      "timeElapsedSinceStart": 73.75000000004185,
      "trackPct": 0.5142678618431091
    },
    "0.51468811": {
      "timeElapsedSinceStart": 73.83333333337525,
      "trackPct": 0.5149411559104919
    },
    "0.51520591": {
      "timeElapsedSinceStart": 73.88333333337529,
      "trackPct": 0.5153470635414124
    },
    "0.5157237": {
      "timeElapsedSinceStart": 73.93333333337533,
      "trackPct": 0.5157546401023865
    },
    "0.5162415": {
      "timeElapsedSinceStart": 74.03333333337541,
      "trackPct": 0.5165745615959167
    },
    "0.51675929": {
      "timeElapsedSinceStart": 74.06666666670877,
      "trackPct": 0.5168492197990417
    },
    "0.51727709": {
      "timeElapsedSinceStart": 74.16666666670885,
      "trackPct": 0.5176774263381958
    },
    "0.51779488": {
      "timeElapsedSinceStart": 74.21666666670889,
      "trackPct": 0.5180938839912415
    },
    "0.51831268": {
      "timeElapsedSinceStart": 74.26666666670893,
      "trackPct": 0.5185118913650513
    },
    "0.51883047": {
      "timeElapsedSinceStart": 74.35000000004233,
      "trackPct": 0.5192120671272278
    },
    "0.51934827": {
      "timeElapsedSinceStart": 74.40000000004237,
      "trackPct": 0.5196341872215271
    },
    "0.51986606": {
      "timeElapsedSinceStart": 74.45000000004241,
      "trackPct": 0.5200579166412354
    },
    "0.52038386": {
      "timeElapsedSinceStart": 74.50000000004245,
      "trackPct": 0.5204832553863525
    },
    "0.52090165": {
      "timeElapsedSinceStart": 74.58333333337585,
      "trackPct": 0.5211938619613647
    },
    "0.52141945": {
      "timeElapsedSinceStart": 74.63333333337589,
      "trackPct": 0.5216221213340759
    },
    "0.52193724": {
      "timeElapsedSinceStart": 74.68333333337593,
      "trackPct": 0.5220519304275513
    },
    "0.52245504": {
      "timeElapsedSinceStart": 74.73333333337597,
      "trackPct": 0.5224836468696594
    },
    "0.52297283": {
      "timeElapsedSinceStart": 74.81666666670937,
      "trackPct": 0.5232067108154297
    },
    "0.52349063": {
      "timeElapsedSinceStart": 74.8666666667094,
      "trackPct": 0.5236423015594482
    },
    "0.52400842": {
      "timeElapsedSinceStart": 74.91666666670945,
      "trackPct": 0.5240793228149414
    },
    "0.52452622": {
      "timeElapsedSinceStart": 75.00000000004285,
      "trackPct": 0.5248108506202698
    },
    "0.52504401": {
      "timeElapsedSinceStart": 75.05000000004289,
      "trackPct": 0.5252517461776733
    },
    "0.52556181": {
      "timeElapsedSinceStart": 75.10000000004293,
      "trackPct": 0.5256941318511963
    },
    "0.5260796": {
      "timeElapsedSinceStart": 75.15000000004297,
      "trackPct": 0.5261380672454834
    },
    "0.5265974": {
      "timeElapsedSinceStart": 75.23333333337636,
      "trackPct": 0.526881217956543
    },
    "0.52711519": {
      "timeElapsedSinceStart": 75.2833333333764,
      "trackPct": 0.5273290276527405
    },
    "0.52763299": {
      "timeElapsedSinceStart": 75.33333333337644,
      "trackPct": 0.5277782678604126
    },
    "0.52815078": {
      "timeElapsedSinceStart": 75.38333333337648,
      "trackPct": 0.5282288193702698
    },
    "0.52866858": {
      "timeElapsedSinceStart": 75.43333333337652,
      "trackPct": 0.5286807417869568
    },
    "0.52918637": {
      "timeElapsedSinceStart": 75.51666666670992,
      "trackPct": 0.5294368863105774
    },
    "0.52970417": {
      "timeElapsedSinceStart": 75.56666666670996,
      "trackPct": 0.5298923254013062
    },
    "0.53022196": {
      "timeElapsedSinceStart": 75.61666666671,
      "trackPct": 0.5303491353988647
    },
    "0.53073976": {
      "timeElapsedSinceStart": 75.66666666671004,
      "trackPct": 0.5308071970939636
    },
    "0.53125755": {
      "timeElapsedSinceStart": 75.75000000004344,
      "trackPct": 0.5315738320350647
    },
    "0.53177535": {
      "timeElapsedSinceStart": 75.80000000004348,
      "trackPct": 0.5320353507995605
    },
    "0.53229314": {
      "timeElapsedSinceStart": 75.85000000004352,
      "trackPct": 0.5324980616569519
    },
    "0.53281094": {
      "timeElapsedSinceStart": 75.93333333337692,
      "trackPct": 0.5332717299461365
    },
    "0.53332873": {
      "timeElapsedSinceStart": 75.98333333337696,
      "trackPct": 0.5337374806404114
    },
    "0.53384653": {
      "timeElapsedSinceStart": 76.033333333377,
      "trackPct": 0.5342044830322266
    },
    "0.53436432": {
      "timeElapsedSinceStart": 76.08333333337704,
      "trackPct": 0.5346726775169373
    },
    "0.53488212": {
      "timeElapsedSinceStart": 76.1166666667104,
      "trackPct": 0.5349855422973633
    },
    "0.53539991": {
      "timeElapsedSinceStart": 76.16666666671044,
      "trackPct": 0.5354557037353516
    },
    "0.53591771": {
      "timeElapsedSinceStart": 76.21666666671048,
      "trackPct": 0.5359268188476562
    },
    "0.5364355": {
      "timeElapsedSinceStart": 76.31666666671056,
      "trackPct": 0.5368682742118835
    },
    "0.53695329": {
      "timeElapsedSinceStart": 76.35000000004392,
      "trackPct": 0.5371806025505066
    },
    "0.53747109": {
      "timeElapsedSinceStart": 76.40000000004396,
      "trackPct": 0.5376468300819397
    },
    "0.53798888": {
      "timeElapsedSinceStart": 76.450000000044,
      "trackPct": 0.5381096005439758
    },
    "0.53850668": {
      "timeElapsedSinceStart": 76.50000000004404,
      "trackPct": 0.538567841053009
    },
    "0.53902447": {
      "timeElapsedSinceStart": 76.58333333337744,
      "trackPct": 0.5393211841583252
    },
    "0.53954227": {
      "timeElapsedSinceStart": 76.63333333337748,
      "trackPct": 0.5397663116455078
    },
    "0.54006006": {
      "timeElapsedSinceStart": 76.68333333337752,
      "trackPct": 0.5402060747146606
    },
    "0.54057786": {
      "timeElapsedSinceStart": 76.73333333337756,
      "trackPct": 0.5406404137611389
    },
    "0.54109565": {
      "timeElapsedSinceStart": 76.81666666671096,
      "trackPct": 0.5413524508476257
    },
    "0.54161345": {
      "timeElapsedSinceStart": 76.866666666711,
      "trackPct": 0.5417719483375549
    },
    "0.54213124": {
      "timeElapsedSinceStart": 76.91666666671104,
      "trackPct": 0.5421855449676514
    },
    "0.54264904": {
      "timeElapsedSinceStart": 77.01666666671112,
      "trackPct": 0.5429949164390564
    },
    "0.54316683": {
      "timeElapsedSinceStart": 77.05000000004448,
      "trackPct": 0.5432595610618591
    },
    "0.54368463": {
      "timeElapsedSinceStart": 77.15000000004456,
      "trackPct": 0.544037401676178
    },
    "0.54420242": {
      "timeElapsedSinceStart": 77.2000000000446,
      "trackPct": 0.5444172620773315
    },
    "0.54472022": {
      "timeElapsedSinceStart": 77.25000000004464,
      "trackPct": 0.5447913408279419
    },
    "0.54523801": {
      "timeElapsedSinceStart": 77.33333333337804,
      "trackPct": 0.5454028844833374
    },
    "0.54575581": {
      "timeElapsedSinceStart": 77.38333333337808,
      "trackPct": 0.5457619428634644
    },
    "0.5462736": {
      "timeElapsedSinceStart": 77.48333333337816,
      "trackPct": 0.5464622378349304
    },
    "0.5467914": {
      "timeElapsedSinceStart": 77.56666666671155,
      "trackPct": 0.5470274686813354
    },
    "0.54730919": {
      "timeElapsedSinceStart": 77.6166666667116,
      "trackPct": 0.547359049320221
    },
    "0.54782699": {
      "timeElapsedSinceStart": 77.71666666671167,
      "trackPct": 0.5480055212974548
    },
    "0.54834478": {
      "timeElapsedSinceStart": 77.80000000004507,
      "trackPct": 0.5485278964042664
    },
    "0.54886258": {
      "timeElapsedSinceStart": 77.90000000004515,
      "trackPct": 0.5491368770599365
    },
    "0.54938037": {
      "timeElapsedSinceStart": 77.9500000000452,
      "trackPct": 0.5494348406791687
    },
    "0.54989817": {
      "timeElapsedSinceStart": 78.0333333333786,
      "trackPct": 0.5499234795570374
    },
    "0.55041596": {
      "timeElapsedSinceStart": 78.13333333337867,
      "trackPct": 0.5504961013793945
    },
    "0.55093376": {
      "timeElapsedSinceStart": 78.21666666671207,
      "trackPct": 0.5509622097015381
    },
    "0.55145155": {
      "timeElapsedSinceStart": 78.31666666671215,
      "trackPct": 0.5515119433403015
    },
    "0.55196935": {
      "timeElapsedSinceStart": 78.41666666671223,
      "trackPct": 0.5520532131195068
    },
    "0.55248714": {
      "timeElapsedSinceStart": 78.50000000004563,
      "trackPct": 0.5524984002113342
    },
    "0.55300494": {
      "timeElapsedSinceStart": 78.60000000004571,
      "trackPct": 0.5530282855033875
    },
    "0.55352273": {
      "timeElapsedSinceStart": 78.73333333337915,
      "trackPct": 0.5537371635437012
    },
    "0.55404053": {
      "timeElapsedSinceStart": 78.83333333337923,
      "trackPct": 0.5542648434638977
    },
    "0.55455832": {
      "timeElapsedSinceStart": 78.91666666671263,
      "trackPct": 0.5547022819519043
    },
    "0.55507612": {
      "timeElapsedSinceStart": 79.01666666671271,
      "trackPct": 0.5552239418029785
    },
    "0.55559391": {
      "timeElapsedSinceStart": 79.10000000004611,
      "trackPct": 0.5556557774543762
    },
    "0.55611171": {
      "timeElapsedSinceStart": 79.20000000004619,
      "trackPct": 0.5561710000038147
    },
    "0.5566295": {
      "timeElapsedSinceStart": 79.30000000004627,
      "trackPct": 0.556683361530304
    },
    "0.5571473": {
      "timeElapsedSinceStart": 79.43333333337971,
      "trackPct": 0.5573636889457703
    },
    "0.55766509": {
      "timeElapsedSinceStart": 79.53333333337979,
      "trackPct": 0.5578750371932983
    },
    "0.55818289": {
      "timeElapsedSinceStart": 79.61666666671319,
      "trackPct": 0.5583011507987976
    },
    "0.55870068": {
      "timeElapsedSinceStart": 79.71666666671327,
      "trackPct": 0.5588061809539795
    },
    "0.55921847": {
      "timeElapsedSinceStart": 79.80000000004667,
      "trackPct": 0.5592221021652222
    },
    "0.55973627": {
      "timeElapsedSinceStart": 79.95000000004678,
      "trackPct": 0.5599607825279236
    },
    "0.56025406": {
      "timeElapsedSinceStart": 80.03333333338018,
      "trackPct": 0.5603668689727783
    },
    "0.56077186": {
      "timeElapsedSinceStart": 80.13333333338026,
      "trackPct": 0.5608507990837097
    },
    "0.56128965": {
      "timeElapsedSinceStart": 80.2666666667137,
      "trackPct": 0.5614946484565735
    },
    "0.56180745": {
      "timeElapsedSinceStart": 80.36666666671378,
      "trackPct": 0.5619772672653198
    },
    "0.56232524": {
      "timeElapsedSinceStart": 80.45000000004718,
      "trackPct": 0.5623789429664612
    },
    "0.56284304": {
      "timeElapsedSinceStart": 80.55000000004726,
      "trackPct": 0.5628586411476135
    },
    "0.56336083": {
      "timeElapsedSinceStart": 80.6833333333807,
      "trackPct": 0.5635005831718445
    },
    "0.56387863": {
      "timeElapsedSinceStart": 80.78333333338078,
      "trackPct": 0.5639886856079102
    },
    "0.56439642": {
      "timeElapsedSinceStart": 80.88333333338086,
      "trackPct": 0.564486563205719
    },
    "0.56491422": {
      "timeElapsedSinceStart": 81.0166666667143,
      "trackPct": 0.5651655793190002
    },
    "0.56543201": {
      "timeElapsedSinceStart": 81.11666666671438,
      "trackPct": 0.5656879544258118
    },
    "0.56594981": {
      "timeElapsedSinceStart": 81.20000000004778,
      "trackPct": 0.5661314725875854
    },
    "0.5664676": {
      "timeElapsedSinceStart": 81.30000000004786,
      "trackPct": 0.5666725635528564
    },
    "0.5669854": {
      "timeElapsedSinceStart": 81.38333333338126,
      "trackPct": 0.5671336054801941
    },
    "0.56750319": {
      "timeElapsedSinceStart": 81.48333333338134,
      "trackPct": 0.5676975846290588
    },
    "0.56802099": {
      "timeElapsedSinceStart": 81.56666666671474,
      "trackPct": 0.5681753754615784
    },
    "0.56853878": {
      "timeElapsedSinceStart": 81.66666666671482,
      "trackPct": 0.5687575340270996
    },
    "0.56905658": {
      "timeElapsedSinceStart": 81.7666666667149,
      "trackPct": 0.5693492889404297
    },
    "0.56957437": {
      "timeElapsedSinceStart": 81.8500000000483,
      "trackPct": 0.5698493123054504
    },
    "0.57009217": {
      "timeElapsedSinceStart": 81.90000000004834,
      "trackPct": 0.5701524615287781
    },
    "0.57060996": {
      "timeElapsedSinceStart": 82.00000000004842,
      "trackPct": 0.570765495300293
    },
    "0.57112776": {
      "timeElapsedSinceStart": 82.08333333338182,
      "trackPct": 0.5712835788726807
    },
    "0.57164555": {
      "timeElapsedSinceStart": 82.1833333333819,
      "trackPct": 0.57191401720047
    },
    "0.57216335": {
      "timeElapsedSinceStart": 82.23333333338194,
      "trackPct": 0.5722329020500183
    },
    "0.57268114": {
      "timeElapsedSinceStart": 82.31666666671534,
      "trackPct": 0.5727702379226685
    },
    "0.57319894": {
      "timeElapsedSinceStart": 82.41666666671541,
      "trackPct": 0.5734246969223022
    },
    "0.57371673": {
      "timeElapsedSinceStart": 82.50000000004881,
      "trackPct": 0.5739747881889343
    },
    "0.57423453": {
      "timeElapsedSinceStart": 82.55000000004885,
      "trackPct": 0.5743067860603333
    },
    "0.57475232": {
      "timeElapsedSinceStart": 82.65000000004893,
      "trackPct": 0.5749773383140564
    },
    "0.57527012": {
      "timeElapsedSinceStart": 82.70000000004897,
      "trackPct": 0.5753158330917358
    },
    "0.57578791": {
      "timeElapsedSinceStart": 82.78333333338237,
      "trackPct": 0.5758844017982483
    },
    "0.57630571": {
      "timeElapsedSinceStart": 82.88333333338245,
      "trackPct": 0.576574444770813
    },
    "0.5768235": {
      "timeElapsedSinceStart": 82.96666666671585,
      "trackPct": 0.5771556496620178
    },
    "0.5773413": {
      "timeElapsedSinceStart": 83.01666666671589,
      "trackPct": 0.5775070786476135
    },
    "0.57785909": {
      "timeElapsedSinceStart": 83.06666666671593,
      "trackPct": 0.5778605341911316
    },
    "0.57837689": {
      "timeElapsedSinceStart": 83.15000000004933,
      "trackPct": 0.5784540176391602
    },
    "0.57889468": {
      "timeElapsedSinceStart": 83.25000000004941,
      "trackPct": 0.5791733860969543
    },
    "0.57941248": {
      "timeElapsedSinceStart": 83.30000000004945,
      "trackPct": 0.5795360803604126
    },
    "0.57993027": {
      "timeElapsedSinceStart": 83.38333333338285,
      "trackPct": 0.5801448822021484
    },
    "0.58044807": {
      "timeElapsedSinceStart": 83.43333333338289,
      "trackPct": 0.5805128216743469
    },
    "0.58096586": {
      "timeElapsedSinceStart": 83.53333333338297,
      "trackPct": 0.5812545418739319
    },
    "0.58148365": {
      "timeElapsedSinceStart": 83.58333333338301,
      "trackPct": 0.5816283226013184
    },
    "0.58200145": {
      "timeElapsedSinceStart": 83.66666666671641,
      "trackPct": 0.582255482673645
    },
    "0.58251924": {
      "timeElapsedSinceStart": 83.71666666671645,
      "trackPct": 0.5826343894004822
    },
    "0.58303704": {
      "timeElapsedSinceStart": 83.81666666671653,
      "trackPct": 0.5833979249000549
    },
    "0.58355483": {
      "timeElapsedSinceStart": 83.85000000004989,
      "trackPct": 0.5836540460586548
    },
    "0.58407263": {
      "timeElapsedSinceStart": 83.95000000004997,
      "trackPct": 0.5844275951385498
    },
    "0.58459042": {
      "timeElapsedSinceStart": 84.00000000005001,
      "trackPct": 0.584817111492157
    },
    "0.58510822": {
      "timeElapsedSinceStart": 84.08333333338341,
      "trackPct": 0.5854702591896057
    },
    "0.58562601": {
      "timeElapsedSinceStart": 84.13333333338345,
      "trackPct": 0.5858645439147949
    },
    "0.58614381": {
      "timeElapsedSinceStart": 84.18333333338349,
      "trackPct": 0.5862605571746826
    },
    "0.5866616": {
      "timeElapsedSinceStart": 84.26666666671689,
      "trackPct": 0.5869243741035461
    },
    "0.5871794": {
      "timeElapsedSinceStart": 84.31666666671693,
      "trackPct": 0.587324857711792
    },
    "0.58769719": {
      "timeElapsedSinceStart": 84.36666666671697,
      "trackPct": 0.5877269506454468
    },
    "0.58821499": {
      "timeElapsedSinceStart": 84.46666666671705,
      "trackPct": 0.5885363221168518
    },
    "0.58873278": {
      "timeElapsedSinceStart": 84.5000000000504,
      "trackPct": 0.5888076424598694
    },
    "0.58925058": {
      "timeElapsedSinceStart": 84.60000000005049,
      "trackPct": 0.5896257758140564
    },
    "0.58976837": {
      "timeElapsedSinceStart": 84.65000000005053,
      "trackPct": 0.5900373458862305
    },
    "0.59028617": {
      "timeElapsedSinceStart": 84.70000000005057,
      "trackPct": 0.5904505848884583
    },
    "0.59080396": {
      "timeElapsedSinceStart": 84.78333333338396,
      "trackPct": 0.591143012046814
    },
    "0.59132176": {
      "timeElapsedSinceStart": 84.833333333384,
      "trackPct": 0.5915606617927551
    },
    "0.59183955": {
      "timeElapsedSinceStart": 84.88333333338404,
      "trackPct": 0.5919799208641052
    },
    "0.59235735": {
      "timeElapsedSinceStart": 84.93333333338408,
      "trackPct": 0.5924006700515747
    },
    "0.59287514": {
      "timeElapsedSinceStart": 85.01666666671748,
      "trackPct": 0.5931055545806885
    },
    "0.59339294": {
      "timeElapsedSinceStart": 85.06666666671752,
      "trackPct": 0.5935304760932922
    },
    "0.59391073": {
      "timeElapsedSinceStart": 85.11666666671756,
      "trackPct": 0.5939570069313049
    },
    "0.59442853": {
      "timeElapsedSinceStart": 85.20000000005096,
      "trackPct": 0.5946714878082275
    },
    "0.59494632": {
      "timeElapsedSinceStart": 85.250000000051,
      "trackPct": 0.5951024889945984
    },
    "0.59546412": {
      "timeElapsedSinceStart": 85.30000000005104,
      "trackPct": 0.5955352187156677
    },
    "0.59598191": {
      "timeElapsedSinceStart": 85.40000000005112,
      "trackPct": 0.596405029296875
    },
    "0.59649971": {
      "timeElapsedSinceStart": 85.43333333338448,
      "trackPct": 0.5966961979866028
    },
    "0.5970175": {
      "timeElapsedSinceStart": 85.48333333338452,
      "trackPct": 0.5971341729164124
    },
    "0.5975353": {
      "timeElapsedSinceStart": 85.53333333338456,
      "trackPct": 0.5975727438926697
    },
    "0.59805309": {
      "timeElapsedSinceStart": 85.61666666671796,
      "trackPct": 0.598305344581604
    },
    "0.59857089": {
      "timeElapsedSinceStart": 85.666666666718,
      "trackPct": 0.5987468957901001
    },
    "0.59908868": {
      "timeElapsedSinceStart": 85.71666666671804,
      "trackPct": 0.599189817905426
    },
    "0.59960648": {
      "timeElapsedSinceStart": 85.76666666671808,
      "trackPct": 0.5996341109275818
    },
    "0.60012427": {
      "timeElapsedSinceStart": 85.85000000005148,
      "trackPct": 0.6003777980804443
    },
    "0.60064207": {
      "timeElapsedSinceStart": 85.90000000005152,
      "trackPct": 0.6008257865905762
    },
    "0.60115986": {
      "timeElapsedSinceStart": 85.95000000005156,
      "trackPct": 0.6012752056121826
    },
    "0.60167766": {
      "timeElapsedSinceStart": 86.0000000000516,
      "trackPct": 0.6017258763313293
    },
    "0.60219545": {
      "timeElapsedSinceStart": 86.083333333385,
      "trackPct": 0.6024799942970276
    },
    "0.60271325": {
      "timeElapsedSinceStart": 86.13333333338504,
      "trackPct": 0.6029342412948608
    },
    "0.60323104": {
      "timeElapsedSinceStart": 86.18333333338508,
      "trackPct": 0.6033896207809448
    },
    "0.60374883": {
      "timeElapsedSinceStart": 86.23333333338512,
      "trackPct": 0.6038463711738586
    },
    "0.60426663": {
      "timeElapsedSinceStart": 86.31666666671852,
      "trackPct": 0.6046102046966553
    },
    "0.60478442": {
      "timeElapsedSinceStart": 86.36666666671856,
      "trackPct": 0.6050702929496765
    },
    "0.60530222": {
      "timeElapsedSinceStart": 86.4166666667186,
      "trackPct": 0.6055318713188171
    },
    "0.60582001": {
      "timeElapsedSinceStart": 86.46666666671864,
      "trackPct": 0.6059947609901428
    },
    "0.60633781": {
      "timeElapsedSinceStart": 86.55000000005204,
      "trackPct": 0.6067690253257751
    },
    "0.6068556": {
      "timeElapsedSinceStart": 86.60000000005208,
      "trackPct": 0.607235312461853
    },
    "0.6073734": {
      "timeElapsedSinceStart": 86.65000000005212,
      "trackPct": 0.6077028512954712
    },
    "0.60789119": {
      "timeElapsedSinceStart": 86.70000000005216,
      "trackPct": 0.6081715822219849
    },
    "0.60840899": {
      "timeElapsedSinceStart": 86.73333333338552,
      "trackPct": 0.6084848642349243
    },
    "0.60892678": {
      "timeElapsedSinceStart": 86.78333333338556,
      "trackPct": 0.6089557409286499
    },
    "0.60944458": {
      "timeElapsedSinceStart": 86.88333333338564,
      "trackPct": 0.6099013090133667
    },
    "0.60996237": {
      "timeElapsedSinceStart": 86.93333333338568,
      "trackPct": 0.6103759407997131
    },
    "0.61048017": {
      "timeElapsedSinceStart": 86.96666666671904,
      "trackPct": 0.610693097114563
    },
    "0.61099796": {
      "timeElapsedSinceStart": 87.01666666671908,
      "trackPct": 0.611169695854187
    },
    "0.61151576": {
      "timeElapsedSinceStart": 87.06666666671912,
      "trackPct": 0.6116476058959961
    },
    "0.61203355": {
      "timeElapsedSinceStart": 87.11666666671915,
      "trackPct": 0.6121267080307007
    },
    "0.61255135": {
      "timeElapsedSinceStart": 87.1666666667192,
      "trackPct": 0.6126070618629456
    },
    "0.61306914": {
      "timeElapsedSinceStart": 87.2500000000526,
      "trackPct": 0.6134102940559387
    },
    "0.61358694": {
      "timeElapsedSinceStart": 87.30000000005263,
      "trackPct": 0.6138937473297119
    },
    "0.61410473": {
      "timeElapsedSinceStart": 87.35000000005267,
      "trackPct": 0.6143783330917358
    },
    "0.61462253": {
      "timeElapsedSinceStart": 87.38333333338603,
      "trackPct": 0.614702045917511
    },
    "0.61514032": {
      "timeElapsedSinceStart": 87.43333333338607,
      "trackPct": 0.6151885390281677
    },
    "0.61565812": {
      "timeElapsedSinceStart": 87.48333333338611,
      "trackPct": 0.6156761646270752
    },
    "0.61617591": {
      "timeElapsedSinceStart": 87.5833333333862,
      "trackPct": 0.6166548132896423
    },
    "0.61669371": {
      "timeElapsedSinceStart": 87.61666666671955,
      "trackPct": 0.616982102394104
    },
    "0.6172115": {
      "timeElapsedSinceStart": 87.66666666671959,
      "trackPct": 0.6174739003181458
    },
    "0.6177293": {
      "timeElapsedSinceStart": 87.71666666671963,
      "trackPct": 0.6179667115211487
    },
    "0.61824709": {
      "timeElapsedSinceStart": 87.76666666671967,
      "trackPct": 0.6184607148170471
    },
    "0.61876489": {
      "timeElapsedSinceStart": 87.81666666671971,
      "trackPct": 0.6189558506011963
    },
    "0.61928268": {
      "timeElapsedSinceStart": 87.85000000005307,
      "trackPct": 0.6192865371704102
    },
    "0.61980048": {
      "timeElapsedSinceStart": 87.95000000005315,
      "trackPct": 0.6202812194824219
    },
    "0.62031827": {
      "timeElapsedSinceStart": 88.00000000005319,
      "trackPct": 0.6207802295684814
    },
    "0.62083607": {
      "timeElapsedSinceStart": 88.05000000005323,
      "trackPct": 0.6212804913520813
    },
    "0.62135386": {
      "timeElapsedSinceStart": 88.08333333338659,
      "trackPct": 0.6216144561767578
    },
    "0.62187166": {
      "timeElapsedSinceStart": 88.13333333338663,
      "trackPct": 0.6221161484718323
    },
    "0.62238945": {
      "timeElapsedSinceStart": 88.18333333338667,
      "trackPct": 0.6226187348365784
    },
    "0.62290725": {
      "timeElapsedSinceStart": 88.23333333338671,
      "trackPct": 0.6231222152709961
    },
    "0.62342504": {
      "timeElapsedSinceStart": 88.28333333338675,
      "trackPct": 0.6236265301704407
    },
    "0.62394284": {
      "timeElapsedSinceStart": 88.31666666672011,
      "trackPct": 0.6239632964134216
    },
    "0.62446063": {
      "timeElapsedSinceStart": 88.36666666672015,
      "trackPct": 0.6244691014289856
    },
    "0.62497843": {
      "timeElapsedSinceStart": 88.46666666672023,
      "trackPct": 0.6254836916923523
    },
    "0.62549622": {
      "timeElapsedSinceStart": 88.50000000005359,
      "trackPct": 0.6258227825164795
    },
    "0.62601401": {
      "timeElapsedSinceStart": 88.55000000005363,
      "trackPct": 0.62633216381073
    },
    "0.62653181": {
      "timeElapsedSinceStart": 88.60000000005367,
      "trackPct": 0.6268424987792969
    },
    "0.6270496": {
      "timeElapsedSinceStart": 88.65000000005371,
      "trackPct": 0.627353847026825
    },
    "0.6275674": {
      "timeElapsedSinceStart": 88.70000000005375,
      "trackPct": 0.6278661489486694
    },
    "0.62808519": {
      "timeElapsedSinceStart": 88.73333333338711,
      "trackPct": 0.6282082200050354
    },
    "0.62860299": {
      "timeElapsedSinceStart": 88.78333333338715,
      "trackPct": 0.6287220120429993
    },
    "0.62912078": {
      "timeElapsedSinceStart": 88.83333333338719,
      "trackPct": 0.6292366981506348
    },
    "0.62963858": {
      "timeElapsedSinceStart": 88.88333333338723,
      "trackPct": 0.6297522187232971
    },
    "0.63015637": {
      "timeElapsedSinceStart": 88.93333333338727,
      "trackPct": 0.6302685141563416
    },
    "0.63067417": {
      "timeElapsedSinceStart": 89.01666666672067,
      "trackPct": 0.631131112575531
    },
    "0.63119196": {
      "timeElapsedSinceStart": 89.0666666667207,
      "trackPct": 0.6316496133804321
    },
    "0.63170976": {
      "timeElapsedSinceStart": 89.11666666672075,
      "trackPct": 0.6321686506271362
    },
    "0.63222755": {
      "timeElapsedSinceStart": 89.16666666672079,
      "trackPct": 0.6326882243156433
    },
    "0.63274535": {
      "timeElapsedSinceStart": 89.20000000005415,
      "trackPct": 0.6330349445343018
    },
    "0.63326314": {
      "timeElapsedSinceStart": 89.25000000005419,
      "trackPct": 0.6335556507110596
    },
    "0.63378094": {
      "timeElapsedSinceStart": 89.30000000005423,
      "trackPct": 0.6340769529342651
    },
    "0.63429873": {
      "timeElapsedSinceStart": 89.35000000005427,
      "trackPct": 0.6345978379249573
    },
    "0.63481653": {
      "timeElapsedSinceStart": 89.4000000000543,
      "trackPct": 0.6351190805435181
    },
    "0.63533432": {
      "timeElapsedSinceStart": 89.43333333338767,
      "trackPct": 0.6354670524597168
    },
    "0.63585212": {
      "timeElapsedSinceStart": 89.4833333333877,
      "trackPct": 0.6359896063804626
    },
    "0.63636991": {
      "timeElapsedSinceStart": 89.53333333338774,
      "trackPct": 0.6365130543708801
    },
    "0.63688771": {
      "timeElapsedSinceStart": 89.58333333338778,
      "trackPct": 0.6370372772216797
    },
    "0.6374055": {
      "timeElapsedSinceStart": 89.63333333338782,
      "trackPct": 0.6375622749328613
    },
    "0.6379233": {
      "timeElapsedSinceStart": 89.71666666672122,
      "trackPct": 0.6384390592575073
    },
    "0.63895889": {
      "timeElapsedSinceStart": 89.76666666672126,
      "trackPct": 0.6389662027359009
    },
    "0.63947668": {
      "timeElapsedSinceStart": 89.8166666667213,
      "trackPct": 0.6394942402839661
    },
    "0.63999448": {
      "timeElapsedSinceStart": 89.9000000000547,
      "trackPct": 0.6403763890266418
    },
    "0.64051227": {
      "timeElapsedSinceStart": 89.95000000005474,
      "trackPct": 0.6409066319465637
    },
    "0.64103007": {
      "timeElapsedSinceStart": 90.00000000005478,
      "trackPct": 0.6414376497268677
    },
    "0.64154786": {
      "timeElapsedSinceStart": 90.05000000005482,
      "trackPct": 0.6419693231582642
    },
    "0.64206566": {
      "timeElapsedSinceStart": 90.08333333338818,
      "trackPct": 0.6423242092132568
    },
    "0.64258345": {
      "timeElapsedSinceStart": 90.13333333338822,
      "trackPct": 0.6428571939468384
    },
    "0.64310125": {
      "timeElapsedSinceStart": 90.18333333338826,
      "trackPct": 0.6433908939361572
    },
    "0.64361904": {
      "timeElapsedSinceStart": 90.2333333333883,
      "trackPct": 0.6439254283905029
    },
    "0.64413684": {
      "timeElapsedSinceStart": 90.28333333338834,
      "trackPct": 0.6444607377052307
    },
    "0.64465463": {
      "timeElapsedSinceStart": 90.3166666667217,
      "trackPct": 0.644818127155304
    },
    "0.64517243": {
      "timeElapsedSinceStart": 90.36666666672174,
      "trackPct": 0.6453549265861511
    },
    "0.64569022": {
      "timeElapsedSinceStart": 90.41666666672178,
      "trackPct": 0.6458925604820251
    },
    "0.64620802": {
      "timeElapsedSinceStart": 90.46666666672182,
      "trackPct": 0.646431028842926
    },
    "0.64672581": {
      "timeElapsedSinceStart": 90.51666666672186,
      "trackPct": 0.6469703912734985
    },
    "0.64724361": {
      "timeElapsedSinceStart": 90.55000000005522,
      "trackPct": 0.6473304629325867
    },
    "0.6477614": {
      "timeElapsedSinceStart": 90.60000000005526,
      "trackPct": 0.647871196269989
    },
    "0.6482792": {
      "timeElapsedSinceStart": 90.6500000000553,
      "trackPct": 0.6484128832817078
    },
    "0.64879699": {
      "timeElapsedSinceStart": 90.70000000005534,
      "trackPct": 0.6489554643630981
    },
    "0.64931478": {
      "timeElapsedSinceStart": 90.75000000005538,
      "trackPct": 0.6494990587234497
    },
    "0.64983258": {
      "timeElapsedSinceStart": 90.78333333338874,
      "trackPct": 0.6498620510101318
    },
    "0.65035037": {
      "timeElapsedSinceStart": 90.83333333338878,
      "trackPct": 0.6504075527191162
    },
    "0.65086817": {
      "timeElapsedSinceStart": 90.88333333338882,
      "trackPct": 0.6509537696838379
    },
    "0.65138596": {
      "timeElapsedSinceStart": 90.93333333338886,
      "trackPct": 0.6515007019042969
    },
    "0.65190376": {
      "timeElapsedSinceStart": 90.9833333333889,
      "trackPct": 0.6520485877990723
    },
    "0.65293935": {
      "timeElapsedSinceStart": 91.0666666667223,
      "trackPct": 0.6529639363288879
    },
    "0.65345714": {
      "timeElapsedSinceStart": 91.11666666672234,
      "trackPct": 0.6535147428512573
    },
    "0.65397494": {
      "timeElapsedSinceStart": 91.16666666672238,
      "trackPct": 0.6540667414665222
    },
    "0.65449273": {
      "timeElapsedSinceStart": 91.21666666672242,
      "trackPct": 0.6546199321746826
    },
    "0.65552832": {
      "timeElapsedSinceStart": 91.30000000005582,
      "trackPct": 0.6555445194244385
    },
    "0.65604612": {
      "timeElapsedSinceStart": 91.35000000005586,
      "trackPct": 0.656100869178772
    },
    "0.65656391": {
      "timeElapsedSinceStart": 91.4000000000559,
      "trackPct": 0.6566582918167114
    },
    "0.65708171": {
      "timeElapsedSinceStart": 91.45000000005594,
      "trackPct": 0.6572167277336121
    },
    "0.6581173": {
      "timeElapsedSinceStart": 91.53333333338934,
      "trackPct": 0.658149242401123
    },
    "0.65863509": {
      "timeElapsedSinceStart": 91.58333333338938,
      "trackPct": 0.6587097644805908
    },
    "0.65915289": {
      "timeElapsedSinceStart": 91.63333333338942,
      "trackPct": 0.6592706441879272
    },
    "0.65967068": {
      "timeElapsedSinceStart": 91.68333333338946,
      "trackPct": 0.6598314046859741
    },
    "0.66018848": {
      "timeElapsedSinceStart": 91.71666666672282,
      "trackPct": 0.6602051258087158
    },
    "0.66070627": {
      "timeElapsedSinceStart": 91.76666666672286,
      "trackPct": 0.6607650518417358
    },
    "0.66122407": {
      "timeElapsedSinceStart": 91.8166666667229,
      "trackPct": 0.6613235473632812
    },
    "0.66174186": {
      "timeElapsedSinceStart": 91.86666666672294,
      "trackPct": 0.6618803143501282
    },
    "0.66225966": {
      "timeElapsedSinceStart": 91.91666666672297,
      "trackPct": 0.6624347567558289
    },
    "0.66277745": {
      "timeElapsedSinceStart": 91.95000000005633,
      "trackPct": 0.6628032922744751
    },
    "0.66329525": {
      "timeElapsedSinceStart": 92.00000000005637,
      "trackPct": 0.6633543968200684
    },
    "0.66381304": {
      "timeElapsedSinceStart": 92.05000000005641,
      "trackPct": 0.663903534412384
    },
    "0.66433084": {
      "timeElapsedSinceStart": 92.10000000005645,
      "trackPct": 0.6644509434700012
    },
    "0.66484863": {
      "timeElapsedSinceStart": 92.1500000000565,
      "trackPct": 0.6649966835975647
    },
    "0.66588422": {
      "timeElapsedSinceStart": 92.2333333333899,
      "trackPct": 0.6659029722213745
    },
    "0.66640202": {
      "timeElapsedSinceStart": 92.28333333338993,
      "trackPct": 0.6664450764656067
    },
    "0.66691981": {
      "timeElapsedSinceStart": 92.33333333338997,
      "trackPct": 0.6669860482215881
    },
    "0.66743761": {
      "timeElapsedSinceStart": 92.38333333339001,
      "trackPct": 0.6675262451171875
    },
    "0.6679554": {
      "timeElapsedSinceStart": 92.46666666672341,
      "trackPct": 0.6684249639511108
    },
    "0.6684732": {
      "timeElapsedSinceStart": 92.51666666672345,
      "trackPct": 0.668963611125946
    },
    "0.66899099": {
      "timeElapsedSinceStart": 92.56666666672349,
      "trackPct": 0.6695014834403992
    },
    "0.67002658": {
      "timeElapsedSinceStart": 92.61666666672353,
      "trackPct": 0.6700383424758911
    },
    "0.67054438": {
      "timeElapsedSinceStart": 92.70000000005693,
      "trackPct": 0.6709305644035339
    },
    "0.67106217": {
      "timeElapsedSinceStart": 92.75000000005697,
      "trackPct": 0.6714640855789185
    },
    "0.67157996": {
      "timeElapsedSinceStart": 92.80000000005701,
      "trackPct": 0.6719958782196045
    },
    "0.67209776": {
      "timeElapsedSinceStart": 92.85000000005705,
      "trackPct": 0.67252516746521
    },
    "0.67261555": {
      "timeElapsedSinceStart": 92.88333333339041,
      "trackPct": 0.672876238822937
    },
    "0.67313335": {
      "timeElapsedSinceStart": 92.93333333339045,
      "trackPct": 0.673399806022644
    },
    "0.67365114": {
      "timeElapsedSinceStart": 92.98333333339049,
      "trackPct": 0.6739192605018616
    },
    "0.67416894": {
      "timeElapsedSinceStart": 93.03333333339053,
      "trackPct": 0.6744341850280762
    },
    "0.67468673": {
      "timeElapsedSinceStart": 93.08333333339057,
      "trackPct": 0.6749441027641296
    },
    "0.67520453": {
      "timeElapsedSinceStart": 93.11666666672393,
      "trackPct": 0.6752811670303345
    },
    "0.67572232": {
      "timeElapsedSinceStart": 93.16666666672397,
      "trackPct": 0.6757822036743164
    },
    "0.67624012": {
      "timeElapsedSinceStart": 93.21666666672401,
      "trackPct": 0.6762772798538208
    },
    "0.67675791": {
      "timeElapsedSinceStart": 93.26666666672405,
      "trackPct": 0.6767663359642029
    },
    "0.67727571": {
      "timeElapsedSinceStart": 93.35000000005745,
      "trackPct": 0.6775661706924438
    },
    "0.6777935": {
      "timeElapsedSinceStart": 93.40000000005749,
      "trackPct": 0.6780359148979187
    },
    "0.6783113": {
      "timeElapsedSinceStart": 93.45000000005753,
      "trackPct": 0.6784986853599548
    },
    "0.67882909": {
      "timeElapsedSinceStart": 93.50000000005757,
      "trackPct": 0.6789559721946716
    },
    "0.67934689": {
      "timeElapsedSinceStart": 93.55000000005761,
      "trackPct": 0.6794072985649109
    },
    "0.67986468": {
      "timeElapsedSinceStart": 93.63333333339101,
      "trackPct": 0.6801469922065735
    },
    "0.68038248": {
      "timeElapsedSinceStart": 93.68333333339105,
      "trackPct": 0.6805827617645264
    },
    "0.68090027": {
      "timeElapsedSinceStart": 93.73333333339109,
      "trackPct": 0.6810126900672913
    },
    "0.68141807": {
      "timeElapsedSinceStart": 93.78333333339113,
      "trackPct": 0.6814371943473816
    },
    "0.68193586": {
      "timeElapsedSinceStart": 93.86666666672453,
      "trackPct": 0.6821343302726746
    },
    "0.68245366": {
      "timeElapsedSinceStart": 93.91666666672457,
      "trackPct": 0.68254554271698
    },
    "0.68297145": {
      "timeElapsedSinceStart": 94.01666666672465,
      "trackPct": 0.683352530002594
    },
    "0.68348925": {
      "timeElapsedSinceStart": 94.050000000058,
      "trackPct": 0.6836168169975281
    },
    "0.68400704": {
      "timeElapsedSinceStart": 94.10000000005805,
      "trackPct": 0.6840079426765442
    },
    "0.68452484": {
      "timeElapsedSinceStart": 94.20000000005813,
      "trackPct": 0.6847788691520691
    },
    "0.68504263": {
      "timeElapsedSinceStart": 94.25000000005817,
      "trackPct": 0.6851545572280884
    },
    "0.68556043": {
      "timeElapsedSinceStart": 94.33333333339156,
      "trackPct": 0.6857627034187317
    },
    "0.68607822": {
      "timeElapsedSinceStart": 94.3833333333916,
      "trackPct": 0.6861177682876587
    },
    "0.68659602": {
      "timeElapsedSinceStart": 94.48333333339168,
      "trackPct": 0.6868076920509338
    },
    "0.68711381": {
      "timeElapsedSinceStart": 94.56666666672508,
      "trackPct": 0.6873652935028076
    },
    "0.68763161": {
      "timeElapsedSinceStart": 94.61666666672512,
      "trackPct": 0.6876934766769409
    },
    "0.6881494": {
      "timeElapsedSinceStart": 94.7166666667252,
      "trackPct": 0.6883373856544495
    },
    "0.6886672": {
      "timeElapsedSinceStart": 94.8000000000586,
      "trackPct": 0.6888626217842102
    },
    "0.68918499": {
      "timeElapsedSinceStart": 94.90000000005868,
      "trackPct": 0.6894838809967041
    },
    "0.68970279": {
      "timeElapsedSinceStart": 94.95000000005872,
      "trackPct": 0.6897914409637451
    },
    "0.69022058": {
      "timeElapsedSinceStart": 95.03333333339212,
      "trackPct": 0.6902998685836792
    },
    "0.69073838": {
      "timeElapsedSinceStart": 95.1333333333922,
      "trackPct": 0.690900981426239
    },
    "0.69125617": {
      "timeElapsedSinceStart": 95.2166666667256,
      "trackPct": 0.6913952231407166
    },
    "0.69177397": {
      "timeElapsedSinceStart": 95.31666666672568,
      "trackPct": 0.6919807195663452
    },
    "0.69229176": {
      "timeElapsedSinceStart": 95.40000000005908,
      "trackPct": 0.6924629807472229
    },
    "0.69280956": {
      "timeElapsedSinceStart": 95.50000000005916,
      "trackPct": 0.6930354237556458
    },
    "0.69332735": {
      "timeElapsedSinceStart": 95.60000000005924,
      "trackPct": 0.6936017870903015
    },
    "0.69384514": {
      "timeElapsedSinceStart": 95.68333333339264,
      "trackPct": 0.694069504737854
    },
    "0.69436294": {
      "timeElapsedSinceStart": 95.78333333339272,
      "trackPct": 0.6946271657943726
    },
    "0.69488073": {
      "timeElapsedSinceStart": 95.83333333339276,
      "trackPct": 0.6949049830436707
    },
    "0.69539853": {
      "timeElapsedSinceStart": 95.9666666667262,
      "trackPct": 0.6956401467323303
    },
    "0.69591632": {
      "timeElapsedSinceStart": 96.06666666672628,
      "trackPct": 0.6961849927902222
    },
    "0.69643412": {
      "timeElapsedSinceStart": 96.15000000005968,
      "trackPct": 0.6966366767883301
    },
    "0.69695191": {
      "timeElapsedSinceStart": 96.25000000005976,
      "trackPct": 0.6971783638000488
    },
    "0.69746971": {
      "timeElapsedSinceStart": 96.33333333339316,
      "trackPct": 0.6976305246353149
    },
    "0.6979875": {
      "timeElapsedSinceStart": 96.43333333339324,
      "trackPct": 0.6981762647628784
    },
    "0.6985053": {
      "timeElapsedSinceStart": 96.51666666672664,
      "trackPct": 0.6986359357833862
    },
    "0.69902309": {
      "timeElapsedSinceStart": 96.61666666672672,
      "trackPct": 0.6991940140724182
    },
    "0.69954089": {
      "timeElapsedSinceStart": 96.7166666667268,
      "trackPct": 0.6997562646865845
    },
    "0.70005868": {
      "timeElapsedSinceStart": 96.8000000000602,
      "trackPct": 0.7002274990081787
    },
    "0.70057648": {
      "timeElapsedSinceStart": 96.90000000006027,
      "trackPct": 0.7007985711097717
    },
    "0.70109427": {
      "timeElapsedSinceStart": 96.98333333339367,
      "trackPct": 0.7012808918952942
    },
    "0.70161207": {
      "timeElapsedSinceStart": 97.08333333339375,
      "trackPct": 0.7018710374832153
    },
    "0.70212986": {
      "timeElapsedSinceStart": 97.1333333333938,
      "trackPct": 0.7021712064743042
    },
    "0.70264766": {
      "timeElapsedSinceStart": 97.21666666672719,
      "trackPct": 0.7026789784431458
    },
    "0.70316545": {
      "timeElapsedSinceStart": 97.31666666672727,
      "trackPct": 0.7032932043075562
    },
    "0.70368325": {
      "timeElapsedSinceStart": 97.41666666672735,
      "trackPct": 0.7039129137992859
    },
    "0.70420104": {
      "timeElapsedSinceStart": 97.50000000006075,
      "trackPct": 0.7044327855110168
    },
    "0.70471884": {
      "timeElapsedSinceStart": 97.55000000006079,
      "trackPct": 0.704746425151825
    },
    "0.70523663": {
      "timeElapsedSinceStart": 97.65000000006087,
      "trackPct": 0.705376923084259
    },
    "0.70575443": {
      "timeElapsedSinceStart": 97.73333333339427,
      "trackPct": 0.7059061527252197
    },
    "0.70627222": {
      "timeElapsedSinceStart": 97.83333333339435,
      "trackPct": 0.7065449953079224
    },
    "0.70679002": {
      "timeElapsedSinceStart": 97.88333333339439,
      "trackPct": 0.7068651914596558
    },
    "0.70730781": {
      "timeElapsedSinceStart": 97.96666666672779,
      "trackPct": 0.7073991894721985
    },
    "0.70782561": {
      "timeElapsedSinceStart": 98.06666666672787,
      "trackPct": 0.7080413699150085
    },
    "0.7083434": {
      "timeElapsedSinceStart": 98.11666666672791,
      "trackPct": 0.7083620429039001
    },
    "0.7088612": {
      "timeElapsedSinceStart": 98.20000000006131,
      "trackPct": 0.7088950872421265
    },
    "0.70937899": {
      "timeElapsedSinceStart": 98.30000000006139,
      "trackPct": 0.7095333337783813
    },
    "0.70989679": {
      "timeElapsedSinceStart": 98.38333333339479,
      "trackPct": 0.7100640535354614
    },
    "0.71041458": {
      "timeElapsedSinceStart": 98.48333333339487,
      "trackPct": 0.7106999754905701
    },
    "0.71093238": {
      "timeElapsedSinceStart": 98.5333333333949,
      "trackPct": 0.7110179662704468
    },
    "0.71145017": {
      "timeElapsedSinceStart": 98.6166666667283,
      "trackPct": 0.711548924446106
    },
    "0.71196797": {
      "timeElapsedSinceStart": 98.71666666672839,
      "trackPct": 0.7121890187263489
    },
    "0.71248576": {
      "timeElapsedSinceStart": 98.76666666672843,
      "trackPct": 0.712510883808136
    },
    "0.71300356": {
      "timeElapsedSinceStart": 98.85000000006183,
      "trackPct": 0.713049054145813
    },
    "0.71352135": {
      "timeElapsedSinceStart": 98.9500000000619,
      "trackPct": 0.7136954665184021
    },
    "0.71403915": {
      "timeElapsedSinceStart": 99.05000000006198,
      "trackPct": 0.7143411040306091
    },
    "0.71455694": {
      "timeElapsedSinceStart": 99.13333333339538,
      "trackPct": 0.7148783802986145
    },
    "0.71507474": {
      "timeElapsedSinceStart": 99.18333333339542,
      "trackPct": 0.7151998281478882
    },
    "0.71559253": {
      "timeElapsedSinceStart": 99.2833333333955,
      "trackPct": 0.7158414125442505
    },
    "0.71611032": {
      "timeElapsedSinceStart": 99.33333333339554,
      "trackPct": 0.71616131067276
    },
    "0.71662812": {
      "timeElapsedSinceStart": 99.41666666672894,
      "trackPct": 0.716693639755249
    },
    "0.71714591": {
      "timeElapsedSinceStart": 99.51666666672902,
      "trackPct": 0.717329740524292
    },
    "0.71766371": {
      "timeElapsedSinceStart": 99.60000000006242,
      "trackPct": 0.7178547382354736
    },
    "0.7181815": {
      "timeElapsedSinceStart": 99.7000000000625,
      "trackPct": 0.7184745669364929
    },
    "0.7186993": {
      "timeElapsedSinceStart": 99.75000000006254,
      "trackPct": 0.7187801003456116
    },
    "0.71921709": {
      "timeElapsedSinceStart": 99.83333333339594,
      "trackPct": 0.7192836403846741
    },
    "0.71973489": {
      "timeElapsedSinceStart": 99.93333333339602,
      "trackPct": 0.7198818922042847
    },
    "0.72025268": {
      "timeElapsedSinceStart": 100.01666666672942,
      "trackPct": 0.7203772068023682
    },
    "0.72077048": {
      "timeElapsedSinceStart": 100.1166666667295,
      "trackPct": 0.7209681868553162
    },
    "0.72128827": {
      "timeElapsedSinceStart": 100.21666666672958,
      "trackPct": 0.7215548157691956
    },
    "0.72180607": {
      "timeElapsedSinceStart": 100.30000000006298,
      "trackPct": 0.7220375537872314
    },
    "0.72232386": {
      "timeElapsedSinceStart": 100.35000000006302,
      "trackPct": 0.722324013710022
    },
    "0.72284166": {
      "timeElapsedSinceStart": 100.4500000000631,
      "trackPct": 0.72288978099823
    },
    "0.72335945": {
      "timeElapsedSinceStart": 100.58333333339654,
      "trackPct": 0.7236264944076538
    },
    "0.72387725": {
      "timeElapsedSinceStart": 100.63333333339658,
      "trackPct": 0.7238982319831848
    },
    "0.72439504": {
      "timeElapsedSinceStart": 100.76666666673002,
      "trackPct": 0.7246130704879761
    },
    "0.72491284": {
      "timeElapsedSinceStart": 100.8666666667301,
      "trackPct": 0.7251378893852234
    },
    "0.72543063": {
      "timeElapsedSinceStart": 100.9500000000635,
      "trackPct": 0.7255691885948181
    },
    "0.72594843": {
      "timeElapsedSinceStart": 101.05000000006358,
      "trackPct": 0.726080060005188
    },
    "0.72646622": {
      "timeElapsedSinceStart": 101.15000000006366,
      "trackPct": 0.7265865206718445
    },
    "0.72698402": {
      "timeElapsedSinceStart": 101.23333333339706,
      "trackPct": 0.7270094156265259
    },
    "0.72750181": {
      "timeElapsedSinceStart": 101.33333333339714,
      "trackPct": 0.7275212407112122
    },
    "0.72801961": {
      "timeElapsedSinceStart": 101.46666666673057,
      "trackPct": 0.7282119393348694
    },
    "0.7285374": {
      "timeElapsedSinceStart": 101.56666666673065,
      "trackPct": 0.7287346720695496
    },
    "0.7290552": {
      "timeElapsedSinceStart": 101.65000000006405,
      "trackPct": 0.7291706204414368
    },
    "0.72957299": {
      "timeElapsedSinceStart": 101.75000000006413,
      "trackPct": 0.7296942472457886
    },
    "0.73009079": {
      "timeElapsedSinceStart": 101.83333333339753,
      "trackPct": 0.7301310300827026
    },
    "0.73060858": {
      "timeElapsedSinceStart": 101.93333333339761,
      "trackPct": 0.7306554317474365
    },
    "0.73112638": {
      "timeElapsedSinceStart": 102.03333333339769,
      "trackPct": 0.7311797142028809
    },
    "0.73164417": {
      "timeElapsedSinceStart": 102.16666666673113,
      "trackPct": 0.731880784034729
    },
    "0.73216197": {
      "timeElapsedSinceStart": 102.26666666673121,
      "trackPct": 0.7324104905128479
    },
    "0.73267976": {
      "timeElapsedSinceStart": 102.35000000006461,
      "trackPct": 0.7328554391860962
    },
    "0.73319756": {
      "timeElapsedSinceStart": 102.45000000006469,
      "trackPct": 0.7333928942680359
    },
    "0.73371535": {
      "timeElapsedSinceStart": 102.55000000006477,
      "trackPct": 0.7339311838150024
    },
    "0.73423315": {
      "timeElapsedSinceStart": 102.63333333339817,
      "trackPct": 0.7343800663948059
    },
    "0.73475094": {
      "timeElapsedSinceStart": 102.73333333339825,
      "trackPct": 0.7349196672439575
    },
    "0.73526874": {
      "timeElapsedSinceStart": 102.81666666673165,
      "trackPct": 0.7353712916374207
    },
    "0.73578653": {
      "timeElapsedSinceStart": 102.91666666673173,
      "trackPct": 0.7359167337417603
    },
    "0.73630433": {
      "timeElapsedSinceStart": 103.00000000006513,
      "trackPct": 0.736376166343689
    },
    "0.73682212": {
      "timeElapsedSinceStart": 103.10000000006521,
      "trackPct": 0.7369354367256165
    },
    "0.73733992": {
      "timeElapsedSinceStart": 103.20000000006529,
      "trackPct": 0.7375045418739319
    },
    "0.73785771": {
      "timeElapsedSinceStart": 103.28333333339869,
      "trackPct": 0.7379842400550842
    },
    "0.7383755": {
      "timeElapsedSinceStart": 103.38333333339877,
      "trackPct": 0.738566517829895
    },
    "0.7388933": {
      "timeElapsedSinceStart": 103.46666666673217,
      "trackPct": 0.7390588521957397
    },
    "0.73941109": {
      "timeElapsedSinceStart": 103.56666666673225,
      "trackPct": 0.7396567463874817
    },
    "0.73992889": {
      "timeElapsedSinceStart": 103.61666666673229,
      "trackPct": 0.7399587035179138
    },
    "0.74044668": {
      "timeElapsedSinceStart": 103.70000000006569,
      "trackPct": 0.7404663562774658
    },
    "0.74096448": {
      "timeElapsedSinceStart": 103.80000000006576,
      "trackPct": 0.7410828471183777
    },
    "0.74148227": {
      "timeElapsedSinceStart": 103.90000000006584,
      "trackPct": 0.7417072057723999
    },
    "0.74200007": {
      "timeElapsedSinceStart": 103.98333333339924,
      "trackPct": 0.7422335743904114
    },
    "0.74251786": {
      "timeElapsedSinceStart": 104.03333333339928,
      "trackPct": 0.7425521612167358
    },
    "0.74303566": {
      "timeElapsedSinceStart": 104.11666666673268,
      "trackPct": 0.7430877089500427
    },
    "0.74355345": {
      "timeElapsedSinceStart": 104.21666666673276,
      "trackPct": 0.7437385320663452
    },
    "0.74407125": {
      "timeElapsedSinceStart": 104.31666666673284,
      "trackPct": 0.744398295879364
    },
    "0.74458904": {
      "timeElapsedSinceStart": 104.3500000000662,
      "trackPct": 0.7446200847625732
    },
    "0.74510684": {
      "timeElapsedSinceStart": 104.45000000006628,
      "trackPct": 0.7452895641326904
    },
    "0.74562463": {
      "timeElapsedSinceStart": 104.50000000006632,
      "trackPct": 0.7456271052360535
    },
    "0.74614243": {
      "timeElapsedSinceStart": 104.58333333339972,
      "trackPct": 0.7461937069892883
    },
    "0.74666022": {
      "timeElapsedSinceStart": 104.6833333333998,
      "trackPct": 0.7468802332878113
    },
    "0.74717802": {
      "timeElapsedSinceStart": 104.73333333339984,
      "trackPct": 0.7472259998321533
    },
    "0.74769581": {
      "timeElapsedSinceStart": 104.81666666673324,
      "trackPct": 0.7478061318397522
    },
    "0.74821361": {
      "timeElapsedSinceStart": 104.91666666673332,
      "trackPct": 0.7485087513923645
    },
    "0.7487314": {
      "timeElapsedSinceStart": 104.96666666673336,
      "trackPct": 0.7488626837730408
    },
    "0.7492492": {
      "timeElapsedSinceStart": 105.05000000006676,
      "trackPct": 0.7494565844535828
    },
    "0.74976699": {
      "timeElapsedSinceStart": 105.1000000000668,
      "trackPct": 0.7498153448104858
    },
    "0.75028479": {
      "timeElapsedSinceStart": 105.20000000006688,
      "trackPct": 0.7505388259887695
    },
    "0.75080258": {
      "timeElapsedSinceStart": 105.28333333340028,
      "trackPct": 0.7511476874351501
    },
    "0.75132038": {
      "timeElapsedSinceStart": 105.33333333340032,
      "trackPct": 0.7515155076980591
    },
    "0.75183817": {
      "timeElapsedSinceStart": 105.38333333340036,
      "trackPct": 0.7518852353096008
    },
    "0.75235597": {
      "timeElapsedSinceStart": 105.48333333340044,
      "trackPct": 0.7526305913925171
    },
    "0.75287376": {
      "timeElapsedSinceStart": 105.5166666667338,
      "trackPct": 0.7528807520866394
    },
    "0.75339156": {
      "timeElapsedSinceStart": 105.61666666673388,
      "trackPct": 0.7536361813545227
    },
    "0.75390935": {
      "timeElapsedSinceStart": 105.66666666673392,
      "trackPct": 0.7540166974067688
    },
    "0.75442715": {
      "timeElapsedSinceStart": 105.75000000006732,
      "trackPct": 0.7546547651290894
    },
    "0.75494494": {
      "timeElapsedSinceStart": 105.80000000006736,
      "trackPct": 0.7550399899482727
    },
    "0.75546274": {
      "timeElapsedSinceStart": 105.90000000006744,
      "trackPct": 0.7558160424232483
    },
    "0.75598053": {
      "timeElapsedSinceStart": 105.9333333334008,
      "trackPct": 0.7560762763023376
    },
    "0.75649833": {
      "timeElapsedSinceStart": 106.03333333340088,
      "trackPct": 0.7568615674972534
    },
    "0.75701612": {
      "timeElapsedSinceStart": 106.08333333340092,
      "trackPct": 0.7572568655014038
    },
    "0.75753392": {
      "timeElapsedSinceStart": 106.13333333340096,
      "trackPct": 0.7576538920402527
    },
    "0.75805171": {
      "timeElapsedSinceStart": 106.21666666673435,
      "trackPct": 0.7583193182945251
    },
    "0.75856951": {
      "timeElapsedSinceStart": 106.2666666667344,
      "trackPct": 0.7587208151817322
    },
    "0.7590873": {
      "timeElapsedSinceStart": 106.31666666673443,
      "trackPct": 0.7591241002082825
    },
    "0.7596051": {
      "timeElapsedSinceStart": 106.40000000006783,
      "trackPct": 0.7597997188568115
    },
    "0.76012289": {
      "timeElapsedSinceStart": 106.45000000006787,
      "trackPct": 0.7602072954177856
    },
    "0.76064068": {
      "timeElapsedSinceStart": 106.55000000006795,
      "trackPct": 0.7610273957252502
    },
    "0.76115848": {
      "timeElapsedSinceStart": 106.600000000068,
      "trackPct": 0.761439859867096
    },
    "0.76167627": {
      "timeElapsedSinceStart": 106.63333333340135,
      "trackPct": 0.7617157101631165
    },
    "0.76219407": {
      "timeElapsedSinceStart": 106.73333333340143,
      "trackPct": 0.7625476121902466
    },
    "0.76271186": {
      "timeElapsedSinceStart": 106.78333333340147,
      "trackPct": 0.7629659175872803
    },
    "0.76322966": {
      "timeElapsedSinceStart": 106.83333333340151,
      "trackPct": 0.7633858919143677
    },
    "0.76374745": {
      "timeElapsedSinceStart": 106.91666666673491,
      "trackPct": 0.7640891671180725
    },
    "0.76426525": {
      "timeElapsedSinceStart": 106.96666666673495,
      "trackPct": 0.7645131945610046
    },
    "0.76478304": {
      "timeElapsedSinceStart": 107.01666666673499,
      "trackPct": 0.7649387121200562
    },
    "0.76530084": {
      "timeElapsedSinceStart": 107.06666666673503,
      "trackPct": 0.7653644680976868
    },
    "0.76581863": {
      "timeElapsedSinceStart": 107.15000000006843,
      "trackPct": 0.7660768032073975
    },
    "0.76633643": {
      "timeElapsedSinceStart": 107.20000000006847,
      "trackPct": 0.766506016254425
    },
    "0.76685422": {
      "timeElapsedSinceStart": 107.25000000006851,
      "trackPct": 0.7669368386268616
    },
    "0.76737202": {
      "timeElapsedSinceStart": 107.33333333340191,
      "trackPct": 0.767657995223999
    },
    "0.76788981": {
      "timeElapsedSinceStart": 107.38333333340195,
      "trackPct": 0.7680925130844116
    },
    "0.76840761": {
      "timeElapsedSinceStart": 107.43333333340199,
      "trackPct": 0.7685285806655884
    },
    "0.7689254": {
      "timeElapsedSinceStart": 107.48333333340203,
      "trackPct": 0.7689660787582397
    },
    "0.7694432": {
      "timeElapsedSinceStart": 107.56666666673543,
      "trackPct": 0.7696982622146606
    },
    "0.76996099": {
      "timeElapsedSinceStart": 107.61666666673547,
      "trackPct": 0.7701394557952881
    },
    "0.77047879": {
      "timeElapsedSinceStart": 107.66666666673551,
      "trackPct": 0.7705820798873901
    },
    "0.77099658": {
      "timeElapsedSinceStart": 107.71666666673555,
      "trackPct": 0.771026074886322
    },
    "0.77151438": {
      "timeElapsedSinceStart": 107.80000000006895,
      "trackPct": 0.7717690467834473
    },
    "0.77203217": {
      "timeElapsedSinceStart": 107.85000000006899,
      "trackPct": 0.7722167372703552
    },
    "0.77254997": {
      "timeElapsedSinceStart": 107.90000000006903,
      "trackPct": 0.7726656794548035
    },
    "0.77306776": {
      "timeElapsedSinceStart": 107.95000000006907,
      "trackPct": 0.7731160521507263
    },
    "0.77358556": {
      "timeElapsedSinceStart": 108.03333333340247,
      "trackPct": 0.7738695740699768
    },
    "0.77410335": {
      "timeElapsedSinceStart": 108.0833333334025,
      "trackPct": 0.7743234038352966
    },
    "0.77462115": {
      "timeElapsedSinceStart": 108.13333333340255,
      "trackPct": 0.7747786045074463
    },
    "0.77513894": {
      "timeElapsedSinceStart": 108.18333333340259,
      "trackPct": 0.775235116481781
    },
    "0.77565674": {
      "timeElapsedSinceStart": 108.23333333340263,
      "trackPct": 0.775692880153656
    },
    "0.77617453": {
      "timeElapsedSinceStart": 108.31666666673603,
      "trackPct": 0.776458740234375
    },
    "0.77669233": {
      "timeElapsedSinceStart": 108.36666666673607,
      "trackPct": 0.7769199013710022
    },
    "0.77721012": {
      "timeElapsedSinceStart": 108.4166666667361,
      "trackPct": 0.7773823142051697
    },
    "0.77772792": {
      "timeElapsedSinceStart": 108.46666666673615,
      "trackPct": 0.7778460383415222
    },
    "0.77824571": {
      "timeElapsedSinceStart": 108.55000000006955,
      "trackPct": 0.7786216139793396
    },
    "0.77876351": {
      "timeElapsedSinceStart": 108.60000000006958,
      "trackPct": 0.7790886163711548
    },
    "0.7792813": {
      "timeElapsedSinceStart": 108.65000000006962,
      "trackPct": 0.7795567512512207
    },
    "0.7797991": {
      "timeElapsedSinceStart": 108.70000000006966,
      "trackPct": 0.7800261974334717
    },
    "0.78031689": {
      "timeElapsedSinceStart": 108.73333333340302,
      "trackPct": 0.780339777469635
    },
    "0.78083469": {
      "timeElapsedSinceStart": 108.8333333334031,
      "trackPct": 0.7812838554382324
    },
    "0.78135248": {
      "timeElapsedSinceStart": 108.88333333340314,
      "trackPct": 0.781757652759552
    },
    "0.78187028": {
      "timeElapsedSinceStart": 108.93333333340318,
      "trackPct": 0.7822325825691223
    },
    "0.78238807": {
      "timeElapsedSinceStart": 108.96666666673654,
      "trackPct": 0.7825498580932617
    },
    "0.78290586": {
      "timeElapsedSinceStart": 109.01666666673658,
      "trackPct": 0.7830268144607544
    },
    "0.78342366": {
      "timeElapsedSinceStart": 109.06666666673662,
      "trackPct": 0.7835047841072083
    },
    "0.78394145": {
      "timeElapsedSinceStart": 109.11666666673666,
      "trackPct": 0.7839839458465576
    },
    "0.78445925": {
      "timeElapsedSinceStart": 109.1666666667367,
      "trackPct": 0.7844642400741577
    },
    "0.78497704": {
      "timeElapsedSinceStart": 109.2500000000701,
      "trackPct": 0.7852672934532166
    },
    "0.78549484": {
      "timeElapsedSinceStart": 109.30000000007014,
      "trackPct": 0.7857506275177002
    },
    "0.78601263": {
      "timeElapsedSinceStart": 109.35000000007018,
      "trackPct": 0.7862350344657898
    },
    "0.78653043": {
      "timeElapsedSinceStart": 109.40000000007022,
      "trackPct": 0.7867206335067749
    },
    "0.78704822": {
      "timeElapsedSinceStart": 109.48333333340362,
      "trackPct": 0.787532389163971
    },
    "0.78756602": {
      "timeElapsedSinceStart": 109.53333333340366,
      "trackPct": 0.7880210280418396
    },
    "0.78808381": {
      "timeElapsedSinceStart": 109.5833333334037,
      "trackPct": 0.7885106801986694
    },
    "0.78860161": {
      "timeElapsedSinceStart": 109.63333333340374,
      "trackPct": 0.78900146484375
    },
    "0.7891194": {
      "timeElapsedSinceStart": 109.6666666667371,
      "trackPct": 0.7893292307853699
    },
    "0.7896372": {
      "timeElapsedSinceStart": 109.71666666673714,
      "trackPct": 0.7898217439651489
    },
    "0.79015499": {
      "timeElapsedSinceStart": 109.76666666673718,
      "trackPct": 0.7903153896331787
    },
    "0.79067279": {
      "timeElapsedSinceStart": 109.81666666673722,
      "trackPct": 0.7908100485801697
    },
    "0.79119058": {
      "timeElapsedSinceStart": 109.86666666673726,
      "trackPct": 0.7913058400154114
    },
    "0.79170838": {
      "timeElapsedSinceStart": 109.95000000007066,
      "trackPct": 0.7921345233917236
    },
    "0.79222617": {
      "timeElapsedSinceStart": 110.0000000000707,
      "trackPct": 0.7926331162452698
    },
    "0.79274397": {
      "timeElapsedSinceStart": 110.05000000007074,
      "trackPct": 0.7931327819824219
    },
    "0.79326176": {
      "timeElapsedSinceStart": 110.10000000007078,
      "trackPct": 0.7936335206031799
    },
    "0.79377956": {
      "timeElapsedSinceStart": 110.13333333340414,
      "trackPct": 0.7939678430557251
    },
    "0.79429735": {
      "timeElapsedSinceStart": 110.18333333340418,
      "trackPct": 0.7944701910018921
    },
    "0.79481515": {
      "timeElapsedSinceStart": 110.23333333340422,
      "trackPct": 0.7949736714363098
    },
    "0.79533294": {
      "timeElapsedSinceStart": 110.28333333340426,
      "trackPct": 0.7954780459403992
    },
    "0.79585074": {
      "timeElapsedSinceStart": 110.36666666673766,
      "trackPct": 0.7963210940361023
    },
    "0.79636853": {
      "timeElapsedSinceStart": 110.4166666667377,
      "trackPct": 0.7968282103538513
    },
    "0.79688633": {
      "timeElapsedSinceStart": 110.46666666673774,
      "trackPct": 0.7973362803459167
    },
    "0.79740412": {
      "timeElapsedSinceStart": 110.51666666673778,
      "trackPct": 0.7978453636169434
    },
    "0.79792192": {
      "timeElapsedSinceStart": 110.55000000007114,
      "trackPct": 0.7981852293014526
    },
    "0.79843971": {
      "timeElapsedSinceStart": 110.60000000007118,
      "trackPct": 0.7986959218978882
    },
    "0.79895751": {
      "timeElapsedSinceStart": 110.65000000007122,
      "trackPct": 0.7992076873779297
    },
    "0.7994753": {
      "timeElapsedSinceStart": 110.70000000007126,
      "trackPct": 0.7997203469276428
    },
    "0.7999931": {
      "timeElapsedSinceStart": 110.7500000000713,
      "trackPct": 0.8002339005470276
    },
    "0.80051089": {
      "timeElapsedSinceStart": 110.78333333340466,
      "trackPct": 0.8005768656730652
    },
    "0.80102869": {
      "timeElapsedSinceStart": 110.8333333334047,
      "trackPct": 0.8010920286178589
    },
    "0.80154648": {
      "timeElapsedSinceStart": 110.88333333340474,
      "trackPct": 0.8016082048416138
    },
    "0.80206428": {
      "timeElapsedSinceStart": 110.93333333340478,
      "trackPct": 0.8021251559257507
    },
    "0.80258207": {
      "timeElapsedSinceStart": 110.98333333340481,
      "trackPct": 0.8026419878005981
    },
    "0.80309987": {
      "timeElapsedSinceStart": 111.06666666673821,
      "trackPct": 0.8035046458244324
    },
    "0.80361766": {
      "timeElapsedSinceStart": 111.11666666673825,
      "trackPct": 0.8040235042572021
    },
    "0.80413546": {
      "timeElapsedSinceStart": 111.1666666667383,
      "trackPct": 0.8045432567596436
    },
    "0.80465325": {
      "timeElapsedSinceStart": 111.21666666673833,
      "trackPct": 0.8050640225410461
    },
    "0.80517104": {
      "timeElapsedSinceStart": 111.2500000000717,
      "trackPct": 0.8054115772247314
    },
    "0.80568884": {
      "timeElapsedSinceStart": 111.30000000007173,
      "trackPct": 0.8059338331222534
    },
    "0.80620663": {
      "timeElapsedSinceStart": 111.35000000007177,
      "trackPct": 0.8064568638801575
    },
    "0.80672443": {
      "timeElapsedSinceStart": 111.40000000007181,
      "trackPct": 0.8069807887077332
    },
    "0.80724222": {
      "timeElapsedSinceStart": 111.43333333340517,
      "trackPct": 0.8073306679725647
    },
    "0.80776002": {
      "timeElapsedSinceStart": 111.48333333340521,
      "trackPct": 0.807856023311615
    },
    "0.80827781": {
      "timeElapsedSinceStart": 111.53333333340525,
      "trackPct": 0.8083823323249817
    },
    "0.80879561": {
      "timeElapsedSinceStart": 111.58333333340529,
      "trackPct": 0.8089094758033752
    },
    "0.8093134": {
      "timeElapsedSinceStart": 111.63333333340533,
      "trackPct": 0.8094375133514404
    },
    "0.8098312": {
      "timeElapsedSinceStart": 111.71666666673873,
      "trackPct": 0.8103193640708923
    },
    "0.81034899": {
      "timeElapsedSinceStart": 111.76666666673877,
      "trackPct": 0.810849666595459
    },
    "0.81086679": {
      "timeElapsedSinceStart": 111.81666666673881,
      "trackPct": 0.8113807439804077
    },
    "0.81190238": {
      "timeElapsedSinceStart": 111.86666666673885,
      "trackPct": 0.8119127154350281
    },
    "0.81242017": {
      "timeElapsedSinceStart": 111.95000000007225,
      "trackPct": 0.8128010630607605
    },
    "0.81293797": {
      "timeElapsedSinceStart": 112.00000000007229,
      "trackPct": 0.8133352398872375
    },
    "0.81345576": {
      "timeElapsedSinceStart": 112.05000000007233,
      "trackPct": 0.8138702511787415
    },
    "0.81397356": {
      "timeElapsedSinceStart": 112.10000000007237,
      "trackPct": 0.8144059777259827
    },
    "0.81449135": {
      "timeElapsedSinceStart": 112.15000000007241,
      "trackPct": 0.8149425983428955
    },
    "0.81500915": {
      "timeElapsedSinceStart": 112.18333333340577,
      "trackPct": 0.8153006434440613
    },
    "0.81552694": {
      "timeElapsedSinceStart": 112.23333333340581,
      "trackPct": 0.8158385753631592
    },
    "0.81604474": {
      "timeElapsedSinceStart": 112.28333333340585,
      "trackPct": 0.8163772821426392
    },
    "0.81656253": {
      "timeElapsedSinceStart": 112.33333333340589,
      "trackPct": 0.816916823387146
    },
    "0.81708033": {
      "timeElapsedSinceStart": 112.36666666673925,
      "trackPct": 0.8172768950462341
    },
    "0.81759812": {
      "timeElapsedSinceStart": 112.41666666673929,
      "trackPct": 0.8178176879882812
    },
    "0.81811592": {
      "timeElapsedSinceStart": 112.46666666673933,
      "trackPct": 0.8183592557907104
    },
    "0.81863371": {
      "timeElapsedSinceStart": 112.51666666673937,
      "trackPct": 0.8189015984535217
    },
    "0.81915151": {
      "timeElapsedSinceStart": 112.56666666673941,
      "trackPct": 0.8194447159767151
    },
    "0.8196693": {
      "timeElapsedSinceStart": 112.60000000007277,
      "trackPct": 0.819807231426239
    },
    "0.8201871": {
      "timeElapsedSinceStart": 112.65000000007281,
      "trackPct": 0.8203515410423279
    },
    "0.82070489": {
      "timeElapsedSinceStart": 112.70000000007285,
      "trackPct": 0.8208966851234436
    },
    "0.82122269": {
      "timeElapsedSinceStart": 112.75000000007289,
      "trackPct": 0.8214425444602966
    },
    "0.82174048": {
      "timeElapsedSinceStart": 112.80000000007293,
      "trackPct": 0.8219891786575317
    },
    "0.82225828": {
      "timeElapsedSinceStart": 112.83333333340629,
      "trackPct": 0.8223540186882019
    },
    "0.82277607": {
      "timeElapsedSinceStart": 112.88333333340633,
      "trackPct": 0.8229017853736877
    },
    "0.82329387": {
      "timeElapsedSinceStart": 112.93333333340637,
      "trackPct": 0.8234502673149109
    },
    "0.82381166": {
      "timeElapsedSinceStart": 112.9833333334064,
      "trackPct": 0.8239995241165161
    },
    "0.82432946": {
      "timeElapsedSinceStart": 113.03333333340645,
      "trackPct": 0.8245494961738586
    },
    "0.82484725": {
      "timeElapsedSinceStart": 113.0666666667398,
      "trackPct": 0.8249165415763855
    },
    "0.82536505": {
      "timeElapsedSinceStart": 113.11666666673985,
      "trackPct": 0.8254677057266235
    },
    "0.82588284": {
      "timeElapsedSinceStart": 113.16666666673989,
      "trackPct": 0.8260195255279541
    },
    "0.82640064": {
      "timeElapsedSinceStart": 113.21666666673993,
      "trackPct": 0.8265721797943115
    },
    "0.82691843": {
      "timeElapsedSinceStart": 113.26666666673997,
      "trackPct": 0.8271254301071167
    },
    "0.82743622": {
      "timeElapsedSinceStart": 113.30000000007333,
      "trackPct": 0.8274946212768555
    },
    "0.82795402": {
      "timeElapsedSinceStart": 113.35000000007336,
      "trackPct": 0.8280491232872009
    },
    "0.82847181": {
      "timeElapsedSinceStart": 113.4000000000734,
      "trackPct": 0.8286042213439941
    },
    "0.82898961": {
      "timeElapsedSinceStart": 113.45000000007344,
      "trackPct": 0.8291600346565247
    },
    "0.8295074": {
      "timeElapsedSinceStart": 113.4833333334068,
      "trackPct": 0.8295310139656067
    },
    "0.8300252": {
      "timeElapsedSinceStart": 113.53333333340684,
      "trackPct": 0.8300879597663879
    },
    "0.83054299": {
      "timeElapsedSinceStart": 113.58333333340688,
      "trackPct": 0.8306456208229065
    },
    "0.83106079": {
      "timeElapsedSinceStart": 113.63333333340692,
      "trackPct": 0.8312039375305176
    },
    "0.83157858": {
      "timeElapsedSinceStart": 113.68333333340696,
      "trackPct": 0.831762969493866
    },
    "0.83209638": {
      "timeElapsedSinceStart": 113.71666666674032,
      "trackPct": 0.8321359753608704
    },
    "0.83261417": {
      "timeElapsedSinceStart": 113.76666666674036,
      "trackPct": 0.8326960802078247
    },
    "0.83313197": {
      "timeElapsedSinceStart": 113.8166666667404,
      "trackPct": 0.8332567811012268
    },
    "0.83364976": {
      "timeElapsedSinceStart": 113.86666666674044,
      "trackPct": 0.8338181972503662
    },
    "0.83416756": {
      "timeElapsedSinceStart": 113.91666666674048,
      "trackPct": 0.8343803286552429
    },
    "0.83468535": {
      "timeElapsedSinceStart": 113.95000000007384,
      "trackPct": 0.8347554802894592
    },
    "0.83520315": {
      "timeElapsedSinceStart": 114.00000000007388,
      "trackPct": 0.8353186249732971
    },
    "0.83572094": {
      "timeElapsedSinceStart": 114.05000000007392,
      "trackPct": 0.8358824253082275
    },
    "0.83623874": {
      "timeElapsedSinceStart": 114.10000000007396,
      "trackPct": 0.8364469408988953
    },
    "0.83675653": {
      "timeElapsedSinceStart": 114.13333333340732,
      "trackPct": 0.8368235230445862
    },
    "0.83727433": {
      "timeElapsedSinceStart": 114.18333333340736,
      "trackPct": 0.8373891115188599
    },
    "0.83779212": {
      "timeElapsedSinceStart": 114.2333333334074,
      "trackPct": 0.8379552960395813
    },
    "0.83830992": {
      "timeElapsedSinceStart": 114.28333333340744,
      "trackPct": 0.8385221362113953
    },
    "0.83882771": {
      "timeElapsedSinceStart": 114.33333333340748,
      "trackPct": 0.839089572429657
    },
    "0.83934551": {
      "timeElapsedSinceStart": 114.38333333340752,
      "trackPct": 0.839657723903656
    },
    "0.8398633": {
      "timeElapsedSinceStart": 114.41666666674088,
      "trackPct": 0.8400368094444275
    },
    "0.8403811": {
      "timeElapsedSinceStart": 114.46666666674092,
      "trackPct": 0.8406059145927429
    },
    "0.84089889": {
      "timeElapsedSinceStart": 114.51666666674096,
      "trackPct": 0.8411756157875061
    },
    "0.84141669": {
      "timeElapsedSinceStart": 114.566666666741,
      "trackPct": 0.8417460322380066
    },
    "0.84193448": {
      "timeElapsedSinceStart": 114.60000000007436,
      "trackPct": 0.8421265482902527
    },
    "0.84245228": {
      "timeElapsedSinceStart": 114.6500000000744,
      "trackPct": 0.8426979184150696
    },
    "0.84297007": {
      "timeElapsedSinceStart": 114.70000000007444,
      "trackPct": 0.8432698249816895
    },
    "0.84348787": {
      "timeElapsedSinceStart": 114.75000000007448,
      "trackPct": 0.8438423871994019
    },
    "0.84400566": {
      "timeElapsedSinceStart": 114.80000000007452,
      "trackPct": 0.8444156050682068
    },
    "0.84452346": {
      "timeElapsedSinceStart": 114.83333333340788,
      "trackPct": 0.8447980284690857
    },
    "0.84504125": {
      "timeElapsedSinceStart": 114.88333333340792,
      "trackPct": 0.845372200012207
    },
    "0.84555905": {
      "timeElapsedSinceStart": 114.93333333340796,
      "trackPct": 0.8459469676017761
    },
    "0.84607684": {
      "timeElapsedSinceStart": 114.983333333408,
      "trackPct": 0.846522331237793
    },
    "0.84659464": {
      "timeElapsedSinceStart": 115.03333333340804,
      "trackPct": 0.8470982909202576
    },
    "0.84711243": {
      "timeElapsedSinceStart": 115.0666666667414,
      "trackPct": 0.8474825024604797
    },
    "0.84763023": {
      "timeElapsedSinceStart": 115.11666666674144,
      "trackPct": 0.8480594754219055
    },
    "0.84814802": {
      "timeElapsedSinceStart": 115.16666666674148,
      "trackPct": 0.8486369252204895
    },
    "0.84918361": {
      "timeElapsedSinceStart": 115.21666666674152,
      "trackPct": 0.8492149710655212
    },
    "0.8497014": {
      "timeElapsedSinceStart": 115.26666666674156,
      "trackPct": 0.8497936725616455
    },
    "0.85073699": {
      "timeElapsedSinceStart": 115.35000000007496,
      "trackPct": 0.8507592678070068
    },
    "0.85125479": {
      "timeElapsedSinceStart": 115.400000000075,
      "trackPct": 0.8513394594192505
    },
    "0.85177258": {
      "timeElapsedSinceStart": 115.45000000007504,
      "trackPct": 0.8519201874732971
    },
    "0.85229038": {
      "timeElapsedSinceStart": 115.50000000007508,
      "trackPct": 0.8525014519691467
    },
    "0.85280817": {
      "timeElapsedSinceStart": 115.53333333340844,
      "trackPct": 0.8528892397880554
    },
    "0.85332597": {
      "timeElapsedSinceStart": 115.58333333340848,
      "trackPct": 0.8534713983535767
    },
    "0.85384376": {
      "timeElapsedSinceStart": 115.63333333340852,
      "trackPct": 0.8540542125701904
    },
    "0.85436156": {
      "timeElapsedSinceStart": 115.68333333340856,
      "trackPct": 0.8546375036239624
    },
    "0.85487935": {
      "timeElapsedSinceStart": 115.7333333334086,
      "trackPct": 0.8552212715148926
    },
    "0.85539715": {
      "timeElapsedSinceStart": 115.76666666674195,
      "trackPct": 0.8556107878684998
    },
    "0.85591494": {
      "timeElapsedSinceStart": 115.816666666742,
      "trackPct": 0.8561955690383911
    },
    "0.85643274": {
      "timeElapsedSinceStart": 115.86666666674203,
      "trackPct": 0.8567808866500854
    },
    "0.85695053": {
      "timeElapsedSinceStart": 115.91666666674207,
      "trackPct": 0.857366681098938
    },
    "0.85746833": {
      "timeElapsedSinceStart": 115.96666666674211,
      "trackPct": 0.8579530119895935
    },
    "0.85798612": {
      "timeElapsedSinceStart": 116.00000000007547,
      "trackPct": 0.8583442568778992
    },
    "0.85850392": {
      "timeElapsedSinceStart": 116.05000000007551,
      "trackPct": 0.8589314818382263
    },
    "0.85902171": {
      "timeElapsedSinceStart": 116.10000000007555,
      "trackPct": 0.8595192432403564
    },
    "0.8600573": {
      "timeElapsedSinceStart": 116.1500000000756,
      "trackPct": 0.8601076006889343
    },
    "0.8605751": {
      "timeElapsedSinceStart": 116.20000000007563,
      "trackPct": 0.8606963157653809
    },
    "0.86161069": {
      "timeElapsedSinceStart": 116.28333333340903,
      "trackPct": 0.8616788387298584
    },
    "0.86212848": {
      "timeElapsedSinceStart": 116.33333333340907,
      "trackPct": 0.8622690439224243
    },
    "0.86264628": {
      "timeElapsedSinceStart": 116.38333333340911,
      "trackPct": 0.8628596663475037
    },
    "0.86316407": {
      "timeElapsedSinceStart": 116.43333333340915,
      "trackPct": 0.863450825214386
    },
    "0.86368187": {
      "timeElapsedSinceStart": 116.46666666674251,
      "trackPct": 0.8638452887535095
    },
    "0.86419966": {
      "timeElapsedSinceStart": 116.51666666674255,
      "trackPct": 0.8644372224807739
    },
    "0.86471746": {
      "timeElapsedSinceStart": 116.56666666674259,
      "trackPct": 0.8650296926498413
    },
    "0.86523525": {
      "timeElapsedSinceStart": 116.61666666674263,
      "trackPct": 0.8656226992607117
    },
    "0.86575305": {
      "timeElapsedSinceStart": 116.66666666674267,
      "trackPct": 0.8662160634994507
    },
    "0.86627084": {
      "timeElapsedSinceStart": 116.70000000007603,
      "trackPct": 0.8666120171546936
    },
    "0.86678864": {
      "timeElapsedSinceStart": 116.75000000007607,
      "trackPct": 0.8672059178352356
    },
    "0.86730643": {
      "timeElapsedSinceStart": 116.80000000007611,
      "trackPct": 0.8677991628646851
    },
    "0.86834202": {
      "timeElapsedSinceStart": 116.85000000007615,
      "trackPct": 0.8683929443359375
    },
    "0.86885982": {
      "timeElapsedSinceStart": 116.90000000007619,
      "trackPct": 0.8689870834350586
    },
    "0.86937761": {
      "timeElapsedSinceStart": 116.93333333340955,
      "trackPct": 0.8693835735321045
    },
    "0.86989541": {
      "timeElapsedSinceStart": 116.98333333340959,
      "trackPct": 0.8699785470962524
    },
    "0.8704132": {
      "timeElapsedSinceStart": 117.03333333340963,
      "trackPct": 0.8705740571022034
    },
    "0.870931": {
      "timeElapsedSinceStart": 117.08333333340967,
      "trackPct": 0.8711699843406677
    },
    "0.87144879": {
      "timeElapsedSinceStart": 117.13333333340971,
      "trackPct": 0.8717663288116455
    },
    "0.87196658": {
      "timeElapsedSinceStart": 117.16666666674307,
      "trackPct": 0.8721641898155212
    },
    "0.87248438": {
      "timeElapsedSinceStart": 117.21666666674311,
      "trackPct": 0.8727613687515259
    },
    "0.87300217": {
      "timeElapsedSinceStart": 117.26666666674315,
      "trackPct": 0.873358964920044
    },
    "0.87351997": {
      "timeElapsedSinceStart": 117.31666666674319,
      "trackPct": 0.8739570379257202
    },
    "0.87403776": {
      "timeElapsedSinceStart": 117.36666666674323,
      "trackPct": 0.8745555281639099
    },
    "0.87455556": {
      "timeElapsedSinceStart": 117.40000000007659,
      "trackPct": 0.8749547600746155
    },
    "0.87507335": {
      "timeElapsedSinceStart": 117.45000000007663,
      "trackPct": 0.8755539655685425
    },
    "0.87610894": {
      "timeElapsedSinceStart": 117.50000000007667,
      "trackPct": 0.8761537075042725
    },
    "0.87662674": {
      "timeElapsedSinceStart": 117.55000000007671,
      "trackPct": 0.8767537474632263
    },
    "0.87714453": {
      "timeElapsedSinceStart": 117.60000000007675,
      "trackPct": 0.8773542046546936
    },
    "0.87766233": {
      "timeElapsedSinceStart": 117.6333333334101,
      "trackPct": 0.8777546882629395
    },
    "0.87818012": {
      "timeElapsedSinceStart": 117.68333333341015,
      "trackPct": 0.878355085849762
    },
    "0.87869792": {
      "timeElapsedSinceStart": 117.73333333341019,
      "trackPct": 0.8789546489715576
    },
    "0.87921571": {
      "timeElapsedSinceStart": 117.78333333341023,
      "trackPct": 0.8795525431632996
    },
    "0.87973351": {
      "timeElapsedSinceStart": 117.83333333341027,
      "trackPct": 0.8801481127738953
    },
    "0.8802513": {
      "timeElapsedSinceStart": 117.86666666674363,
      "trackPct": 0.88054358959198
    },
    "0.8807691": {
      "timeElapsedSinceStart": 117.91666666674367,
      "trackPct": 0.8811339139938354
    },
    "0.88128689": {
      "timeElapsedSinceStart": 117.9666666667437,
      "trackPct": 0.881720781326294
    },
    "0.88180469": {
      "timeElapsedSinceStart": 118.01666666674375,
      "trackPct": 0.8823038339614868
    },
    "0.88284028": {
      "timeElapsedSinceStart": 118.06666666674379,
      "trackPct": 0.8828830718994141
    },
    "0.88335807": {
      "timeElapsedSinceStart": 118.15000000007718,
      "trackPct": 0.8838393688201904
    },
    "0.88439366": {
      "timeElapsedSinceStart": 118.20000000007722,
      "trackPct": 0.8844072222709656
    },
    "0.88491146": {
      "timeElapsedSinceStart": 118.25000000007726,
      "trackPct": 0.8849703073501587
    },
    "0.88542925": {
      "timeElapsedSinceStart": 118.3000000000773,
      "trackPct": 0.8855284452438354
    },
    "0.88594705": {
      "timeElapsedSinceStart": 118.3833333334107,
      "trackPct": 0.886446475982666
    },
    "0.88698264": {
      "timeElapsedSinceStart": 118.43333333341074,
      "trackPct": 0.8869894742965698
    },
    "0.88750043": {
      "timeElapsedSinceStart": 118.48333333341078,
      "trackPct": 0.8875265717506409
    },
    "0.88801823": {
      "timeElapsedSinceStart": 118.53333333341082,
      "trackPct": 0.8880581259727478
    },
    "0.88853602": {
      "timeElapsedSinceStart": 118.58333333341086,
      "trackPct": 0.888584315776825
    },
    "0.88905382": {
      "timeElapsedSinceStart": 118.66666666674426,
      "trackPct": 0.889449954032898
    },
    "0.88957161": {
      "timeElapsedSinceStart": 118.7166666667443,
      "trackPct": 0.8899620771408081
    },
    "0.89008941": {
      "timeElapsedSinceStart": 118.76666666674434,
      "trackPct": 0.8904691338539124
    },
    "0.8906072": {
      "timeElapsedSinceStart": 118.8000000000777,
      "trackPct": 0.8908043503761292
    },
    "0.891125": {
      "timeElapsedSinceStart": 118.85000000007774,
      "trackPct": 0.8913031220436096
    },
    "0.89164279": {
      "timeElapsedSinceStart": 118.90000000007778,
      "trackPct": 0.8917970657348633
    },
    "0.89216059": {
      "timeElapsedSinceStart": 118.95000000007782,
      "trackPct": 0.8922863006591797
    },
    "0.89267838": {
      "timeElapsedSinceStart": 119.00000000007786,
      "trackPct": 0.8927710652351379
    },
    "0.89319618": {
      "timeElapsedSinceStart": 119.08333333341126,
      "trackPct": 0.8935691118240356
    },
    "0.89371397": {
      "timeElapsedSinceStart": 119.1333333334113,
      "trackPct": 0.8940423727035522
    },
    "0.89423176": {
      "timeElapsedSinceStart": 119.18333333341134,
      "trackPct": 0.8945116996765137
    },
    "0.89474956": {
      "timeElapsedSinceStart": 119.23333333341138,
      "trackPct": 0.8949772715568542
    },
    "0.89526735": {
      "timeElapsedSinceStart": 119.26666666674474,
      "trackPct": 0.8952855467796326
    },
    "0.89578515": {
      "timeElapsedSinceStart": 119.36666666674482,
      "trackPct": 0.8961998224258423
    },
    "0.89630294": {
      "timeElapsedSinceStart": 119.41666666674486,
      "trackPct": 0.8966510891914368
    },
    "0.89682074": {
      "timeElapsedSinceStart": 119.4666666667449,
      "trackPct": 0.8970987200737
    },
    "0.89733853": {
      "timeElapsedSinceStart": 119.50000000007826,
      "trackPct": 0.8973950147628784
    },
    "0.89785633": {
      "timeElapsedSinceStart": 119.60000000007834,
      "trackPct": 0.8982746005058289
    },
    "0.89837412": {
      "timeElapsedSinceStart": 119.65000000007838,
      "trackPct": 0.8987098336219788
    },
    "0.89889192": {
      "timeElapsedSinceStart": 119.70000000007842,
      "trackPct": 0.8991429209709167
    },
    "0.89940971": {
      "timeElapsedSinceStart": 119.73333333341178,
      "trackPct": 0.899429976940155
    },
    "0.89992751": {
      "timeElapsedSinceStart": 119.83333333341186,
      "trackPct": 0.900284469127655
    },
    "0.9004453": {
      "timeElapsedSinceStart": 119.8833333334119,
      "trackPct": 0.9007081985473633
    },
    "0.9009631": {
      "timeElapsedSinceStart": 119.93333333341194,
      "trackPct": 0.9011298418045044
    },
    "0.90148089": {
      "timeElapsedSinceStart": 119.98333333341198,
      "trackPct": 0.901549220085144
    },
    "0.90199869": {
      "timeElapsedSinceStart": 120.06666666674538,
      "trackPct": 0.9022429585456848
    },
    "0.90251648": {
      "timeElapsedSinceStart": 120.11666666674542,
      "trackPct": 0.9026561975479126
    },
    "0.90303428": {
      "timeElapsedSinceStart": 120.16666666674546,
      "trackPct": 0.9030672311782837
    },
    "0.90355207": {
      "timeElapsedSinceStart": 120.25000000007886,
      "trackPct": 0.9037474989891052
    },
    "0.90406987": {
      "timeElapsedSinceStart": 120.3000000000789,
      "trackPct": 0.9041520953178406
    },
    "0.90458766": {
      "timeElapsedSinceStart": 120.40000000007898,
      "trackPct": 0.9049533605575562
    },
    "0.90510546": {
      "timeElapsedSinceStart": 120.45000000007902,
      "trackPct": 0.9053505063056946
    },
    "0.90562325": {
      "timeElapsedSinceStart": 120.53333333341241,
      "trackPct": 0.9060074687004089
    },
    "0.90614105": {
      "timeElapsedSinceStart": 120.58333333341245,
      "trackPct": 0.9063985347747803
    },
    "0.90665884": {
      "timeElapsedSinceStart": 120.6333333334125,
      "trackPct": 0.9067873954772949
    },
    "0.90717664": {
      "timeElapsedSinceStart": 120.7166666667459,
      "trackPct": 0.9074311852455139
    },
    "0.90769443": {
      "timeElapsedSinceStart": 120.76666666674593,
      "trackPct": 0.907815158367157
    },
    "0.90821223": {
      "timeElapsedSinceStart": 120.86666666674601,
      "trackPct": 0.9085776805877686
    },
    "0.90873002": {
      "timeElapsedSinceStart": 120.90000000007937,
      "trackPct": 0.9088303446769714
    },
    "0.90924782": {
      "timeElapsedSinceStart": 121.00000000007945,
      "trackPct": 0.909583330154419
    },
    "0.90976561": {
      "timeElapsedSinceStart": 121.05000000007949,
      "trackPct": 0.9099572896957397
    },
    "0.91028341": {
      "timeElapsedSinceStart": 121.10000000007953,
      "trackPct": 0.9103296399116516
    },
    "0.9108012": {
      "timeElapsedSinceStart": 121.18333333341293,
      "trackPct": 0.9109464287757874
    },
    "0.911319": {
      "timeElapsedSinceStart": 121.28333333341301,
      "trackPct": 0.9116748571395874
    },
    "0.91183679": {
      "timeElapsedSinceStart": 121.33333333341305,
      "trackPct": 0.9120343923568726
    },
    "0.91235459": {
      "timeElapsedSinceStart": 121.38333333341309,
      "trackPct": 0.9123913645744324
    },
    "0.91287238": {
      "timeElapsedSinceStart": 121.46666666674649,
      "trackPct": 0.9129800796508789
    },
    "0.91339018": {
      "timeElapsedSinceStart": 121.56666666674657,
      "trackPct": 0.9136769771575928
    },
    "0.91390797": {
      "timeElapsedSinceStart": 121.61666666674661,
      "trackPct": 0.9140225648880005
    },
    "0.91442577": {
      "timeElapsedSinceStart": 121.70000000008001,
      "trackPct": 0.9145958423614502
    },
    "0.91494356": {
      "timeElapsedSinceStart": 121.80000000008009,
      "trackPct": 0.9152750968933105
    },
    "0.91546136": {
      "timeElapsedSinceStart": 121.85000000008013,
      "trackPct": 0.915611982345581
    },
    "0.91597915": {
      "timeElapsedSinceStart": 121.93333333341353,
      "trackPct": 0.9161690473556519
    },
    "0.91649695": {
      "timeElapsedSinceStart": 121.98333333341357,
      "trackPct": 0.9165009260177612
    },
    "0.91701474": {
      "timeElapsedSinceStart": 122.08333333341365,
      "trackPct": 0.9171585440635681
    },
    "0.91753253": {
      "timeElapsedSinceStart": 122.16666666674705,
      "trackPct": 0.917701780796051
    },
    "0.91805033": {
      "timeElapsedSinceStart": 122.26666666674713,
      "trackPct": 0.9183482527732849
    },
    "0.91856812": {
      "timeElapsedSinceStart": 122.31666666674717,
      "trackPct": 0.9186694622039795
    },
    "0.91908592": {
      "timeElapsedSinceStart": 122.40000000008057,
      "trackPct": 0.9192018508911133
    },
    "0.91960371": {
      "timeElapsedSinceStart": 122.50000000008065,
      "trackPct": 0.9198364615440369
    },
    "0.92012151": {
      "timeElapsedSinceStart": 122.55000000008069,
      "trackPct": 0.9201523065567017
    },
    "0.9206393": {
      "timeElapsedSinceStart": 122.63333333341409,
      "trackPct": 0.9206770062446594
    },
    "0.9211571": {
      "timeElapsedSinceStart": 122.73333333341417,
      "trackPct": 0.9213042259216309
    },
    "0.92167489": {
      "timeElapsedSinceStart": 122.81666666674757,
      "trackPct": 0.9218245148658752
    },
    "0.92219269": {
      "timeElapsedSinceStart": 122.91666666674764,
      "trackPct": 0.9224452376365662
    },
    "0.92271048": {
      "timeElapsedSinceStart": 122.96666666674768,
      "trackPct": 0.9227535128593445
    },
    "0.92322828": {
      "timeElapsedSinceStart": 123.05000000008108,
      "trackPct": 0.9232637286186218
    },
    "0.92374607": {
      "timeElapsedSinceStart": 123.15000000008116,
      "trackPct": 0.9238712787628174
    },
    "0.92426387": {
      "timeElapsedSinceStart": 123.23333333341456,
      "trackPct": 0.9243743419647217
    },
    "0.92478166": {
      "timeElapsedSinceStart": 123.33333333341464,
      "trackPct": 0.9249749779701233
    },
    "0.92529946": {
      "timeElapsedSinceStart": 123.43333333341472,
      "trackPct": 0.9255729913711548
    },
    "0.92581725": {
      "timeElapsedSinceStart": 123.51666666674812,
      "trackPct": 0.9260691404342651
    },
    "0.92633505": {
      "timeElapsedSinceStart": 123.56666666674816,
      "trackPct": 0.9263660907745361
    },
    "0.92685284": {
      "timeElapsedSinceStart": 123.66666666674824,
      "trackPct": 0.9269610643386841
    },
    "0.92737064": {
      "timeElapsedSinceStart": 123.75000000008164,
      "trackPct": 0.9274588823318481
    },
    "0.92788843": {
      "timeElapsedSinceStart": 123.85000000008172,
      "trackPct": 0.9280572533607483
    },
    "0.92840623": {
      "timeElapsedSinceStart": 123.93333333341512,
      "trackPct": 0.9285563230514526
    },
    "0.92892402": {
      "timeElapsedSinceStart": 124.0333333334152,
      "trackPct": 0.9291562438011169
    },
    "0.92944182": {
      "timeElapsedSinceStart": 124.08333333341524,
      "trackPct": 0.9294567704200745
    },
    "0.92995961": {
      "timeElapsedSinceStart": 124.18333333341532,
      "trackPct": 0.930059015750885
    },
    "0.93047741": {
      "timeElapsedSinceStart": 124.26666666674872,
      "trackPct": 0.9305633306503296
    },
    "0.9309952": {
      "timeElapsedSinceStart": 124.3666666667488,
      "trackPct": 0.9311716556549072
    },
    "0.931513": {
      "timeElapsedSinceStart": 124.4500000000822,
      "trackPct": 0.9316815137863159
    },
    "0.93203079": {
      "timeElapsedSinceStart": 124.55000000008228,
      "trackPct": 0.9322970509529114
    },
    "0.93254859": {
      "timeElapsedSinceStart": 124.60000000008232,
      "trackPct": 0.9326068162918091
    },
    "0.93306638": {
      "timeElapsedSinceStart": 124.68333333341572,
      "trackPct": 0.9331272840499878
    },
    "0.93358418": {
      "timeElapsedSinceStart": 124.7833333334158,
      "trackPct": 0.9337595105171204
    },
    "0.93410197": {
      "timeElapsedSinceStart": 124.8666666667492,
      "trackPct": 0.9342913031578064
    },
    "0.93461977": {
      "timeElapsedSinceStart": 124.96666666674928,
      "trackPct": 0.9349355697631836
    },
    "0.93513756": {
      "timeElapsedSinceStart": 125.01666666674932,
      "trackPct": 0.9352602362632751
    },
    "0.93565536": {
      "timeElapsedSinceStart": 125.10000000008272,
      "trackPct": 0.9358052611351013
    },
    "0.93617315": {
      "timeElapsedSinceStart": 125.2000000000828,
      "trackPct": 0.9364656209945679
    },
    "0.93669095": {
      "timeElapsedSinceStart": 125.25000000008284,
      "trackPct": 0.9367985725402832
    },
    "0.93720874": {
      "timeElapsedSinceStart": 125.33333333341623,
      "trackPct": 0.9373576641082764
    },
    "0.93772654": {
      "timeElapsedSinceStart": 125.43333333341631,
      "trackPct": 0.938035786151886
    },
    "0.93824433": {
      "timeElapsedSinceStart": 125.48333333341635,
      "trackPct": 0.9383780360221863
    },
    "0.93876213": {
      "timeElapsedSinceStart": 125.56666666674975,
      "trackPct": 0.938953697681427
    },
    "0.93927992": {
      "timeElapsedSinceStart": 125.6166666667498,
      "trackPct": 0.939302384853363
    },
    "0.93979771": {
      "timeElapsedSinceStart": 125.71666666674987,
      "trackPct": 0.9400071501731873
    },
    "0.94031551": {
      "timeElapsedSinceStart": 125.80000000008327,
      "trackPct": 0.9405999779701233
    },
    "0.9408333": {
      "timeElapsedSinceStart": 125.85000000008331,
      "trackPct": 0.9409579038619995
    },
    "0.9413511": {
      "timeElapsedSinceStart": 125.95000000008339,
      "trackPct": 0.941677987575531
    },
    "0.94186889": {
      "timeElapsedSinceStart": 125.98333333341675,
      "trackPct": 0.9419196248054504
    },
    "0.94238669": {
      "timeElapsedSinceStart": 126.08333333341683,
      "trackPct": 0.9426485896110535
    },
    "0.94290448": {
      "timeElapsedSinceStart": 126.13333333341687,
      "trackPct": 0.9430156350135803
    },
    "0.94342228": {
      "timeElapsedSinceStart": 126.21666666675027,
      "trackPct": 0.9436317086219788
    },
    "0.94394007": {
      "timeElapsedSinceStart": 126.26666666675031,
      "trackPct": 0.9440035223960876
    },
    "0.94445787": {
      "timeElapsedSinceStart": 126.36666666675039,
      "trackPct": 0.9447523951530457
    },
    "0.94497566": {
      "timeElapsedSinceStart": 126.41666666675043,
      "trackPct": 0.9451298117637634
    },
    "0.94549346": {
      "timeElapsedSinceStart": 126.50000000008383,
      "trackPct": 0.9457634091377258
    },
    "0.94601125": {
      "timeElapsedSinceStart": 126.55000000008387,
      "trackPct": 0.9461461901664734
    },
    "0.94652905": {
      "timeElapsedSinceStart": 126.60000000008391,
      "trackPct": 0.9465307593345642
    },
    "0.94704684": {
      "timeElapsedSinceStart": 126.68333333341731,
      "trackPct": 0.9471738338470459
    },
    "0.94756464": {
      "timeElapsedSinceStart": 126.78333333341739,
      "trackPct": 0.9479494690895081
    },
    "0.94808243": {
      "timeElapsedSinceStart": 126.83333333341743,
      "trackPct": 0.9483388066291809
    },
    "0.94860023": {
      "timeElapsedSinceStart": 126.88333333341747,
      "trackPct": 0.9487292170524597
    },
    "0.94911802": {
      "timeElapsedSinceStart": 126.96666666675087,
      "trackPct": 0.949381947517395
    },
    "0.94963582": {
      "timeElapsedSinceStart": 127.01666666675091,
      "trackPct": 0.9497750997543335
    },
    "0.95015361": {
      "timeElapsedSinceStart": 127.06666666675095,
      "trackPct": 0.9501693844795227
    },
    "0.95067141": {
      "timeElapsedSinceStart": 127.15000000008435,
      "trackPct": 0.9508294463157654
    },
    "0.9511892": {
      "timeElapsedSinceStart": 127.20000000008439,
      "trackPct": 0.9512273669242859
    },
    "0.951707": {
      "timeElapsedSinceStart": 127.30000000008447,
      "trackPct": 0.9520277380943298
    },
    "0.95222479": {
      "timeElapsedSinceStart": 127.3500000000845,
      "trackPct": 0.9524304270744324
    },
    "0.95274259": {
      "timeElapsedSinceStart": 127.4333333334179,
      "trackPct": 0.953105628490448
    },
    "0.95326038": {
      "timeElapsedSinceStart": 127.48333333341795,
      "trackPct": 0.9535130858421326
    },
    "0.95377818": {
      "timeElapsedSinceStart": 127.53333333341799,
      "trackPct": 0.9539220929145813
    },
    "0.95429597": {
      "timeElapsedSinceStart": 127.58333333341803,
      "trackPct": 0.9543324708938599
    },
    "0.95481377": {
      "timeElapsedSinceStart": 127.66666666675142,
      "trackPct": 0.9550195932388306
    },
    "0.95533156": {
      "timeElapsedSinceStart": 127.71666666675146,
      "trackPct": 0.9554337859153748
    },
    "0.95584936": {
      "timeElapsedSinceStart": 127.7666666667515,
      "trackPct": 0.9558494687080383
    },
    "0.95636715": {
      "timeElapsedSinceStart": 127.8500000000849,
      "trackPct": 0.9565456509590149
    },
    "0.95688495": {
      "timeElapsedSinceStart": 127.90000000008494,
      "trackPct": 0.9569653272628784
    },
    "0.95740274": {
      "timeElapsedSinceStart": 128.00000000008504,
      "trackPct": 0.9578092098236084
    },
    "0.95792054": {
      "timeElapsedSinceStart": 128.05000000008505,
      "trackPct": 0.9582334756851196
    },
    "0.95843833": {
      "timeElapsedSinceStart": 128.0833333334184,
      "trackPct": 0.9585171341896057
    },
    "0.95895613": {
      "timeElapsedSinceStart": 128.1833333334185,
      "trackPct": 0.9593695998191833
    },
    "0.95947392": {
      "timeElapsedSinceStart": 128.23333333341856,
      "trackPct": 0.9597979187965393
    },
    "0.95999172": {
      "timeElapsedSinceStart": 128.28333333341857,
      "trackPct": 0.9602276682853699
    },
    "0.96050951": {
      "timeElapsedSinceStart": 128.31666666675193,
      "trackPct": 0.9605149626731873
    },
    "0.96102731": {
      "timeElapsedSinceStart": 128.416666666752,
      "trackPct": 0.9613813161849976
    },
    "0.9615451": {
      "timeElapsedSinceStart": 128.46666666675208,
      "trackPct": 0.9618167877197266
    },
    "0.96206289": {
      "timeElapsedSinceStart": 128.5166666667521,
      "trackPct": 0.9622536897659302
    },
    "0.96258069": {
      "timeElapsedSinceStart": 128.56666666675216,
      "trackPct": 0.9626920223236084
    },
    "0.96309848": {
      "timeElapsedSinceStart": 128.65000000008553,
      "trackPct": 0.9634256362915039
    },
    "0.96361628": {
      "timeElapsedSinceStart": 128.7000000000856,
      "trackPct": 0.9638676643371582
    },
    "0.96413407": {
      "timeElapsedSinceStart": 128.7500000000856,
      "trackPct": 0.9643111228942871
    },
    "0.96465187": {
      "timeElapsedSinceStart": 128.80000000008567,
      "trackPct": 0.9647557735443115
    },
    "0.96516966": {
      "timeElapsedSinceStart": 128.88333333341905,
      "trackPct": 0.9654995799064636
    },
    "0.96568746": {
      "timeElapsedSinceStart": 128.9333333334191,
      "trackPct": 0.965947687625885
    },
    "0.96620525": {
      "timeElapsedSinceStart": 128.98333333341913,
      "trackPct": 0.9663969874382019
    },
    "0.96672305": {
      "timeElapsedSinceStart": 129.06666666675255,
      "trackPct": 0.9671486616134644
    },
    "0.96724084": {
      "timeElapsedSinceStart": 129.11666666675256,
      "trackPct": 0.9676012396812439
    },
    "0.96775864": {
      "timeElapsedSinceStart": 129.16666666675263,
      "trackPct": 0.9680550694465637
    },
    "0.96827643": {
      "timeElapsedSinceStart": 129.21666666675264,
      "trackPct": 0.9685101509094238
    },
    "0.96879423": {
      "timeElapsedSinceStart": 129.250000000086,
      "trackPct": 0.9688142538070679
    },
    "0.96931202": {
      "timeElapsedSinceStart": 129.35000000008608,
      "trackPct": 0.9697295427322388
    },
    "0.96982982": {
      "timeElapsedSinceStart": 129.40000000008615,
      "trackPct": 0.9701887965202332
    },
    "0.97034761": {
      "timeElapsedSinceStart": 129.45000000008616,
      "trackPct": 0.9706493020057678
    },
    "0.97086541": {
      "timeElapsedSinceStart": 129.48333333341952,
      "trackPct": 0.9709570407867432
    },
    "0.9713832": {
      "timeElapsedSinceStart": 129.5333333334196,
      "trackPct": 0.9714195728302002
    },
    "0.971901": {
      "timeElapsedSinceStart": 129.63333333341967,
      "trackPct": 0.9723485708236694
    },
    "0.97241879": {
      "timeElapsedSinceStart": 129.68333333341968,
      "trackPct": 0.9728147983551025
    },
    "0.97293659": {
      "timeElapsedSinceStart": 129.71666666675304,
      "trackPct": 0.9731263518333435
    },
    "0.97345438": {
      "timeElapsedSinceStart": 129.7666666667531,
      "trackPct": 0.973594605922699
    },
    "0.97397218": {
      "timeElapsedSinceStart": 129.81666666675312,
      "trackPct": 0.97406405210495
    },
    "0.97448997": {
      "timeElapsedSinceStart": 129.8666666667532,
      "trackPct": 0.9745346903800964
    },
    "0.97500777": {
      "timeElapsedSinceStart": 129.95000000008656,
      "trackPct": 0.975321888923645
    },
    "0.97552556": {
      "timeElapsedSinceStart": 130.00000000008663,
      "trackPct": 0.9757957458496094
    },
    "0.97604336": {
      "timeElapsedSinceStart": 130.05000000008664,
      "trackPct": 0.9762707352638245
    },
    "0.97656115": {
      "timeElapsedSinceStart": 130.1000000000867,
      "trackPct": 0.9767467975616455
    },
    "0.97707895": {
      "timeElapsedSinceStart": 130.15000000008672,
      "trackPct": 0.9772239923477173
    },
    "0.97759674": {
      "timeElapsedSinceStart": 130.23333333342015,
      "trackPct": 0.978022038936615
    },
    "0.97811454": {
      "timeElapsedSinceStart": 130.28333333342016,
      "trackPct": 0.978502631187439
    },
    "0.97863233": {
      "timeElapsedSinceStart": 130.33333333342023,
      "trackPct": 0.9789844751358032
    },
    "0.97915013": {
      "timeElapsedSinceStart": 130.38333333342024,
      "trackPct": 0.9794674515724182
    },
    "0.97966792": {
      "timeElapsedSinceStart": 130.4166666667536,
      "trackPct": 0.9797900915145874
    },
    "0.98018572": {
      "timeElapsedSinceStart": 130.46666666675367,
      "trackPct": 0.9802747368812561
    },
    "0.98070351": {
      "timeElapsedSinceStart": 130.51666666675368,
      "trackPct": 0.9807605147361755
    },
    "0.98122131": {
      "timeElapsedSinceStart": 130.56666666675375,
      "trackPct": 0.9812475442886353
    },
    "0.9817391": {
      "timeElapsedSinceStart": 130.65000000008712,
      "trackPct": 0.9820613265037537
    },
    "0.9822569": {
      "timeElapsedSinceStart": 130.7000000000872,
      "trackPct": 0.9825509786605835
    },
    "0.98277469": {
      "timeElapsedSinceStart": 130.7500000000872,
      "trackPct": 0.9830417633056641
    },
    "0.98329249": {
      "timeElapsedSinceStart": 130.80000000008727,
      "trackPct": 0.9835333228111267
    },
    "0.98381028": {
      "timeElapsedSinceStart": 130.83333333342063,
      "trackPct": 0.98386150598526
    },
    "0.98432807": {
      "timeElapsedSinceStart": 130.88333333342064,
      "trackPct": 0.9843542575836182
    },
    "0.98484587": {
      "timeElapsedSinceStart": 130.9333333334207,
      "trackPct": 0.9848475456237793
    },
    "0.98536366": {
      "timeElapsedSinceStart": 131.03333333342079,
      "trackPct": 0.9858358502388
    },
    "0.98588146": {
      "timeElapsedSinceStart": 131.06666666675414,
      "trackPct": 0.9861656427383423
    },
    "0.98639925": {
      "timeElapsedSinceStart": 131.11666666675416,
      "trackPct": 0.9866605401039124
    },
    "0.98691705": {
      "timeElapsedSinceStart": 131.16666666675422,
      "trackPct": 0.9871557354927063
    },
    "0.98743484": {
      "timeElapsedSinceStart": 131.21666666675424,
      "trackPct": 0.9876513481140137
    },
    "0.98795264": {
      "timeElapsedSinceStart": 131.2666666667543,
      "trackPct": 0.9881476759910583
    },
    "0.98847043": {
      "timeElapsedSinceStart": 131.30000000008766,
      "trackPct": 0.9884788990020752
    },
    "0.98898823": {
      "timeElapsedSinceStart": 131.40000000008774,
      "trackPct": 0.9894734621047974
    },
    "0.98950602": {
      "timeElapsedSinceStart": 131.45000000008775,
      "trackPct": 0.9899712800979614
    },
    "0.99002382": {
      "timeElapsedSinceStart": 131.50000000008782,
      "trackPct": 0.9904694557189941
    },
    "0.99054161": {
      "timeElapsedSinceStart": 131.53333333342118,
      "trackPct": 0.9908017516136169
    },
    "0.99105941": {
      "timeElapsedSinceStart": 131.5833333334212,
      "trackPct": 0.9913004636764526
    },
    "0.9915772": {
      "timeElapsedSinceStart": 131.63333333342126,
      "trackPct": 0.9917994737625122
    },
    "0.992095": {
      "timeElapsedSinceStart": 131.68333333342127,
      "trackPct": 0.9922986626625061
    },
    "0.99261279": {
      "timeElapsedSinceStart": 131.73333333342134,
      "trackPct": 0.9927981495857239
    },
    "0.99313059": {
      "timeElapsedSinceStart": 131.7666666667547,
      "trackPct": 0.9931312203407288
    },
    "0.99364838": {
      "timeElapsedSinceStart": 131.86666666675478,
      "trackPct": 0.9941312670707703
    },
    "0.99416618": {
      "timeElapsedSinceStart": 131.9166666667548,
      "trackPct": 0.9946317076683044
    },
    "0.99468397": {
      "timeElapsedSinceStart": 131.96666666675486,
      "trackPct": 0.995132327079773
    },
    "0.99520177": {
      "timeElapsedSinceStart": 132.00000000008822,
      "trackPct": 0.9954662322998047
    },
    "0.99571956": {
      "timeElapsedSinceStart": 132.05000000008823,
      "trackPct": 0.9959673285484314
    },
    "0.99623736": {
      "timeElapsedSinceStart": 132.1000000000883,
      "trackPct": 0.996468722820282
    },
    "0.99675515": {
      "timeElapsedSinceStart": 132.1500000000883,
      "trackPct": 0.9969701766967773
    },
    "0.99727295": {
      "timeElapsedSinceStart": 132.20000000008838,
      "trackPct": 0.9974715113639832
    },
    "0.99779074": {
      "timeElapsedSinceStart": 132.23333333342174,
      "trackPct": 0.9978057742118835
    },
    "0.99830854": {
      "timeElapsedSinceStart": 132.33333333342182,
      "trackPct": 0.9988092184066772
    },
    "0.99882633": {
      "timeElapsedSinceStart": 132.38333333342183,
      "trackPct": 0.9993113875389099
    },
    "0.99934413": {
      "timeElapsedSinceStart": 132.4333333334219,
      "trackPct": 0.9998138546943665
    }
  }
};

const refMap = new Map();
for (const [key, value] of Object.entries(debug.refPoints)) {
  refMap.set(parseFloat(key), value);
}

initReferenceInterval(5793.8);

const aheadPct = 0.43631571531295776;
const behindPct = 0.43234583735466003;
const refLap = {
  "startTime": 108.25000076293632,
  "finishTime": 240.71666742969157,
  "refPoints": refMap,
  "lastTrackedPct": 0.9998138546943665,
  "isCleanLap": true
};

console.log(referenceDelta(refLap, aheadPct, behindPct));