import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// sw overlay for new-muslim. Index-aligned with NEW_MUSLIM_TOPICS in ../new-muslim.ts.
export const NEW_MUSLIM_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Karibu katika Uislamu",
    summary: "Ramani fupi na ya vitendo kwa siku na wiki za kwanza za safari yako.",
    body: [
      "Hongera — na karibu. Kuwa Muislamu si mwisho wa safari bali ni mwanzo wa uhusiano wa maisha yote na Mwenyezi Mungu, uhusiano unaokua polepole kupitia elimu, ibada na jamii, si kwa mara moja. Hakuna anayetarajia ujue kila kitu siku ya kwanza; kila Muislamu, wakiwemo Masahaba wa Mtume ﷺ wenyewe, alijifunza dini yake hatua kwa hatua.",
      "Mojawapo ya mafundisho yenye faraja zaidi kwa mtu mpya katika Uislamu ni kwamba yaliyopita yako nyuma yako kweli: 'Do you not know that Islam demolishes what preceded it?' (maana kwa Kiingereza) — Mtume ﷺ alimwambia hivyo Swahaba aliyekuwa na wasiwasi kuhusu madhambi yake ya zamani. Unaanza ukiwa na kumbukumbu safi mbele ya Mwenyezi Mungu.",
      "Mwongozo huu unashughulikia mambo ya msingi — maana ya shahada, nguzo tano, misingi ya imani, na mtazamo wa kwanza wa swala — kisha unakuelekeza kwenye miongozo kamili ya Swala, Aqeedah, Jifunze Dua na Qur'ani katika programu hii kwa undani zaidi. Chukua sehemu moja baada ya nyingine.",
    ],
    actions: [
      "Nenda kwa mwendo wako mwenyewe — soma sehemu moja ya mwongozo huu kwa kila kikao badala ya yote kwa mara moja.",
      "Andika maswali yanayokujia unaposoma; yapeleke baadaye kwa mwalimu au rafiki mwenye elimu.",
    ],
  },
  {
    title: "Maana ya Shahada",
    summary: "Sentensi mbili fupi zinazobeba maana nzima ya Uislamu.",
    body: [
      "Shahada — ushuhuda wa imani — ni: 'Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan rasulullah' ('Nashuhudia kwamba hapana mungu ila Allah, na nashuhudia kwamba Muhammad ni Mjumbe wa Allah'). Ina sehemu mbili, na zote mbili ni muhimu.",
      "Sehemu ya kwanza, la ilaha illallah, inamaanisha kwamba hakuna mtu wala kitu kingine — si pesa, cheo, mababu, masanamu, wala kiumbe chochote — kinachostahili kuabudiwa, kutiiwa kama tendo la ibada, au kutegemewa kikamilifu isipokuwa Allah peke Yake. Ni tamko kuhusu nani mwenye haki ya kuabudiwa, si tu nani aliyepo.",
      "Sehemu ya pili inathibitisha kwamba Muhammad ﷺ ni mjumbe wa mwisho wa Allah, aliyetumwa na uongofu kwa watu wote. Kuthibitisha hili kunamaanisha kuamini yale aliyofundisha ﷺ kuhusu Allah, ibada na namna ya kuishi — na ndiyo sababu Qur'ani na mafundisho yake sahihi (Sunna) ndizo vyanzo viwili ambavyo mwongozo huu wote unategemea.",
      "Ushuhuda huu si dawa ya kichawi bali ni maelezo ya yakini iliyotulia moyoni. Kuutamka kwa ikhlasi, ukielewa maana yake, ndiko kunakomfanya mtu kuwa Muislamu — 'yule anayejisalimisha.'",
    ],
    appLinks: [{ label: "Jifunze Aqeedah — kumwamini Allah" }],
  },
  {
    title: "Kuwa Muislamu",
    summary: "Kinachohesabika ni kutamka shahada kwa ikhlasi — kwa ufahamu na nia.",
    body: [
      "Hakuna padri, sherehe, ada wala makaratasi yanayohitajika ili kuwa Muislamu. Kinachohitajika ni ikhlasi: kuelewa maana ya shahada na kuitamka kwa nia ya kuikubali kama imani yako, kati yako na Allah.",
      "Watu wengi huchagua kuitamka mbele ya wengine — imamu wa eneo lao, jamii ya msikiti, au marafiki — kwa sababu hilo huweka mashahidi wa tukio hilo na hukuunganisha na mtandao wa msaada tangu siku ya kwanza; hili ni jambo linalopendekezwa sana, si sharti la lazima kwa ushuhuda wenyewe.",
      "Baadhi ya Waislamu wapya pia hufanya ghusl (josho kamili la kisheria) katika kipindi hiki kama mwanzo mpya wa kiishara na wa kivitendo kabla ya kujifunza kuswali; desturi na mitazamo kuhusu ni lini na vipi hasa hutofautiana kati ya jamii, kwa hiyo muulize mwalimu wa eneo lako kuhusu desturi iliyopo badala ya kubahatisha.",
      "Ikiwa bado unachunguza na hujapata yakini, hiyo ni hatua ya kawaida na yenye heshima — soma, uliza maswali, na chukua muda wako. Ushuhuda unakusudiwa kutamkwa kwa yakini, si kwa shinikizo.",
    ],
    actions: [
      "Ikiwa uko tayari, fikiria kutamka shahada mbele ya imamu wa eneo lako, jamii ya msikiti, au marafiki Waislamu unaowaamini.",
      "Uliza msikiti au mwalimu wa eneo lako kuhusu hatua zozote za kawaida zinazofuata (kama ghusl) katika jamii yako.",
    ],
  },
  {
    title: "Nguzo Tano za Uislamu",
    summary:
      "Uislamu umesimama juu ya matendo matano ya msingi ya ibada, yaliyotajwa pamoja na Mtume ﷺ.",
    body: [
      "Mtume ﷺ alifupisha muundo wa matendo ya Kiislamu katika hadithi moja: Uislamu umejengwa juu ya nguzo tano — kushuhudia kwamba hapana mungu ila Allah na kwamba Muhammad ni Mjumbe Wake (shahada); kusimamisha swala tano za kila siku; kutoa sadaka ya lazima ya kila mwaka (Zaka); kufunga mwezi wa Ramadhani; na kuhiji Makka (Hija) angalau mara moja, kwa wale wenye uwezo.",
      "Zifikirie kama nyumba: shahada ndio msingi ambao kila kitu kimesimama juu yake, na zile nne nyingine ndizo nguzo zinazoshikilia jengo — ibada ya kila mara (swala), kutoa kila mara (Zaka), mwezi wa kila mwaka wa kujizuia (saumu), na hija ya mara moja maishani (Hija) kwa wenye afya na uwezo wa kusafiri.",
      "Huhitaji kuzimudu zote tano mara moja. Shahada tayari umejifunza kuihusu; swala inaelezwa baadaye katika mwongozo huu; Zaka na saumu hujifunzwa polepole kadiri zinavyofika kila mwaka; Hija hupangwa baadaye maishani hali zikiruhusu.",
    ],
  },
  {
    title: "Zaka, Saumu na Hija kwa Mtazamo",
    summary: "Nguzo tatu zinazokuja na wakati — huhitaji kuzitekeleza leo.",
    body: [
      "Zaka ni wajibu wa kila mwaka — asilimia ndogo iliyowekwa — juu ya akiba na mali inayostahiki iliyozidi kiwango cha chini (nisab), hutolewa kwa makundi maalumu ya watu wenye mahitaji. Kwa kawaida inakuhusu baada ya kumiliki akiba kwa takriban mwaka mmoja, kwa hiyo hakuna haraka; mwongozo wa Zaka katika programu hii unaeleza kila kitu kwa kina wakati wowote utakapouhitaji.",
      "Kufunga Ramadhani kunamaanisha kujizuia na chakula, kinywaji na kujamiiana kuanzia kabla ya alfajiri hadi machweo kwa mwezi mmoja wa mwandamo kila mwaka, pamoja na swala za ziada na kusoma Qur'ani. Ni nguzo yenye mahitaji makubwa lakini yenye malipo mengi sana, ambayo Waislamu wengi wapya huizoea polepole kwa mwongozo wa jamii yao badala ya kuwa peke yao.",
      "Hija ni safari ya kwenda Makka, ya lazima mara moja maishani kwa wale tu wenye uwezo wa kimwili na kifedha kufanya safari hiyo. Ikiwa haiko ndani ya uwezo wako sasa, hakuna mzigo juu yako — Allah humtaka mtu tu kile anachoweza kutoa.",
    ],
    appLinks: [{ label: "Mwongozo wa Zaka" }],
  },
  {
    title: "Jinsi Nguzo Zinavyounda Maisha ya Kila Siku",
    summary:
      "Nguzo tano hugeuza imani kuwa mdundo unaouishi kweli, siku baada ya siku na mwaka baada ya mwaka.",
    body: [
      "Mojawapo ya mambo ambayo Waislamu wapya mara nyingi huyaona mazuri zaidi ni jinsi nguzo zinavyojenga mdundo katika maisha ya kawaida: mapumziko matano mafupi ya swala kila siku, msimu wa kila mwaka wa saumu na tafakuri, tendo la kila mwaka la kutoa, na — hatimaye — hija ya mara moja maishani. Hakuna kati ya haya kilicho nadharia tupu; yote yanaishiwa.",
      "Mdundo huu unakusudiwa kudumu, si kuelemea. Mtume ﷺ alifundisha kwamba matendo anayoyapenda zaidi Allah ni yale yanayodumishwa kwa uthabiti, hata yakiwa madogo — si mlipuko wa ghafla wa bidii unaozimika. Jenga kwanza mazoea madogo na ya kudumu; undani utakuja na wakati.",
    ],
    actions: [
      "Chagua tabia moja ndogo inayoweza kudumu ili uanze nayo wiki hii badala ya kujaribu kufanya kila kitu kwa mara moja.",
    ],
  },
  {
    title: "Nguzo Sita za Imani",
    summary: "Kile anachoamini Muislamu, kwa nukta sita alizofundisha Mtume ﷺ moja kwa moja.",
    body: [
      "Ikiwa nguzo tano ni kile anachokifanya Muislamu, basi nguzo sita za imani (iman) ni kile anachokiamini Muislamu. Zinatoka katika Hadithi ya Jibril, ambapo Malaika Jibril, akiwa katika sura ya mtu, alimwomba Mtume ﷺ aeleze imani mbele ya Masahaba waliokusanyika.",
      "Mtume ﷺ alijibu: kumwamini Allah; Malaika Wake; Vitabu Vyake vilivyoteremshwa; Mitume Wake; Siku ya Mwisho; na makadirio ya Mwenyezi Mungu (qadar) — kheri yake na shari yake. Hizi sita zinaunda picha moja iliyoungana ya uhalisia: nani aliyekuumba, nani anayeongoza ulimwengu usioonekana, jinsi uongofu ulivyowafikia wanadamu, nani aliyeuleta, maisha yanaelekea wapi, na jinsi ya kuushika urahisi na ugumu kwa kumtegemea Allah.",
      "Huhitaji kuimudu falsafa iliyo nyuma ya kila nguzo leo — mwongozo wa Aqeedah katika programu hii unazieleza zote sita kwa kina, pamoja na dalili za kila moja, wakati wowote utakapokuwa tayari kwenda ndani zaidi.",
    ],
    appLinks: [{ label: "Jifunze Aqeedah — nguzo sita" }],
  },
  {
    title: "Allah ni Nani?",
    summary:
      "Mungu Mmoja, asiye na mshirika, wala mfano, wala haja — anayejieleza kwa majina Yake mazuri.",
    body: [
      "Allah ndilo jina halisi la Mungu katika Uislamu — si mungu mwingine, bali ni yule yule Muumba mmoja wa kweli ambaye maandiko ya awali yalimwelekea, sasa anajulikana kwa jina alilolichagua Mwenyewe na anaelezwa kwa sifa Zake zilizofunuliwa badala ya makisio ya wanadamu.",
      "Maelezo mafupi na yaliyo wazi zaidi katika Qur'ani ni Surat al-Ikhlas: Yeye ni Mmoja; hana mshirika wala mfano; hakuzaa wala hakuzaliwa. Allah hana mwili unaoweza kuuwazia na hakuna picha yoyote inayopaswa kutengenezwa kumwakilisha — kumjua Yeye hupatikana kupitia majina Yake (kama Mwingi wa Rehema, Mjuzi wa Yote, Msikivu wa Yote) na matendo Yake katika uumbaji, si kupitia picha au kulinganisha na vitu vya kimwili.",
      "Kumjua Allah kupitia majina Yake mara nyingi ndiyo sehemu ya imani ya mwanzo inayotuliza moyo zaidi: kadiri unavyojifunza zaidi Yeye yukoje, ndivyo swala na kumtegemea kila siku vinavyoanza kuhisika kuwa vya kibinafsi badala ya kuwa vya kimazoea tu.",
    ],
    appLinks: [{ label: "Majina ya Allah" }],
  },
  {
    title: "Qur'ani na Ujumbe wa Mwisho",
    summary:
      "Qur'ani ni maneno ya Allah Mwenyewe, yaliyohifadhiwa bila kubadilika tangu yalipoteremshwa.",
    body: [
      "Waislamu wanaamini kwamba Qur'ani ni maneno halisi ya Allah, yaliyoteremshwa kwa Mtume Muhammad ﷺ katika kipindi cha takriban miaka 23, na yamehifadhiwa neno kwa neno tangu wakati huo — yakihifadhiwa moyoni na vizazi vya Waislamu na hayajawahi kubadilishwa.",
      "Si wasifu wa Mtume ﷺ wala kitabu cha historia, ingawa kina uongofu na visa vya mitume waliotangulia; kimsingi ni kitabu cha uongofu kinachokusudiwa kusomwa, kukaririwa, kutafakariwa na kuishiwa, kidogo kidogo.",
      "Huhitaji kusoma Kiarabu ili kuanza. Anza na tafsiri katika lugha unayoielewa, kwa mpangilio wowote unaokuvutia, na acha kuzoea usomaji wa Kiarabu kukue polepole pamoja na swala yako.",
    ],
    appLinks: [{ label: "Soma Qur'ani" }],
  },
  {
    title: "Jinsi ya Kuswali — Picha Kamili",
    summary:
      "Swala tano fupi kwa siku, kila moja ni mfuatano maalumu wa kusimama, kurukuu na kusujudu.",
    body: [
      "Swala huswaliwa mara tano kwa siku katika nyakati maalumu — Alfajiri (Fajr), Adhuhuri (Dhuhr), Alasiri (Asr), Magharibi (Maghrib) na Isha — na huchukua dakika chache tu kila mara mara utakapoujua mpangilio wake. Nyakati za swala na kifuatiliaji cha programu hii vitakuonyesha hasa ni lini kila wakati unaanza mahali ulipo.",
      "Kila swala imeundwa kwa vipimo vinavyoitwa rakaa (Alfajiri ina mbili, Adhuhuri/Alasiri/Isha zina nne, Magharibi ina tatu), na kila rakaa hufuata umbo lile lile la msingi: kusimama huku ukisoma, kurukuu (ruku'), na sijda mbili (sujud), pamoja na maneno maalumu ya kumsifu Allah na Qur'ani yanayosemwa katika kila hali.",
      "Kabla ya kuswali, unatawadha — udhu ni kuosha kwa kisheria kwa muda mfupi mikono, mdomo, uso, mikono hadi viwiko, kichwa na miguu — na unaswali ukielekea upande wa Al-Kaaba huko Makka (kibla), ambao programu hii pia inaweza kukuonyesha.",
      "Muhtasari huu kwa makusudi ni wa jumla. Maneno halisi yanayosemwa katika kila hali, maelekezo ya hatua kwa hatua kama ya video, na kozi kamili kwa wanaoanza vyote vinapatikana katika mwongozo maalumu wa Swala — anzia hapo kisha, na tumia mwongozo wa matamshi pamoja nao ili kujifunza maneno kwa herufi za Kilatini na tafsiri.",
    ],
    appLinks: [
      { label: "Jifunze Swala — mwongozo kamili" },
      { label: "Matamshi ya swala (kwa herufi za Kilatini)" },
    ],
  },
  {
    title: "Udhu: Kujiandaa Kuswali",
    summary:
      "Kuosha kwa kisheria kwa muda mfupi kunakotayarisha mwili na moyo kusimama mbele ya Allah.",
    body: [
      "Udhu ni wajibu kabla ya kila swala (isipokuwa kama bado uko na udhu halali wa awali) na hufuata mpangilio maalumu: kuosha mikono, kusukutua mdomo na kupandisha maji puani, kuosha uso, mikono hadi viwiko, kupaka maji kichwa na masikio, na kuosha miguu hadi vifundoni.",
      "Hauchukui muda mrefu ukishaujifunza — watu wengi huumaliza kwa chini ya dakika mbili — na pia una maana ya kiroho: kila kiungo kinachooshwa kinahusishwa, katika maandiko ya hadithi, na wazo la makosa madogo kuondoka pamoja na maji hayo.",
      "Mwongozo kamili wa Twahara katika programu hii unaeleza udhu hatua kwa hatua, pamoja na nini cha kufanya ikiwa huna uhakika kama udhu wako bado ni halali.",
    ],
    appLinks: [{ label: "Mwongozo wa Twahara" }],
  },
  {
    title: "Kujifunza Maneno ya Swala",
    summary:
      "Anza na herufi za Kilatini na maana; ufasaha wa Kiarabu huja kwa kurudiarudia kwa muda.",
    body: [
      "Swala huswaliwa kwa Kiarabu, jambo ambalo linaweza kuonekana gumu zaidi mwanzoni — lakini hutarajiwi kuwa fasaha ili kuanza. Waislamu wengi wapya huanza kwa kujifunza maneno machache mafupi ya lazima (takbira ya kufungua, sura fupi, maneno yanayosemwa wakati wa kurukuu na kusujudu, na salamu ya kumalizia) pamoja na herufi za Kilatini na tafsiri kando ya Kiarabu.",
      "Yahifadhi kwa vipande vidogo badala ya yote kwa mara moja, na yarudie kila siku — kumbukumbu ya maneno ya swala hujengeka haraka kupitia kurudia kwa kuswali kwenyewe, hata kabla hujajaribu kwa makusudi kuhifadhi chochote.",
      "Mwongozo maalumu wa matamshi katika programu hii unakupa kila tamko la lazima kwa Kiarabu, herufi za Kilatini na tafsiri pamoja, yakiwa yamepangwa kulingana na mahali kila moja linaposemwa katika swala — litumie kama chombo chako cha mazoezi ya kila siku.",
    ],
    appLinks: [{ label: "Mwongozo wa matamshi ya swala" }],
  },
  {
    title: "Orodha ya Hatua Zako za Kwanza",
    summary: "Mpangilio rahisi na halisi wa kujifunza mambo katika wiki zako za kwanza.",
    body: [
      "Hakuna mpangilio mmoja wa lazima wa kujifunza baada ya shahada, lakini Waislamu wapya mara nyingi huona mfuatano wa jumla kuwa wa msaada ili kusiwe na kitu kinachoelemea kwa mara moja. Tumia hii kama mwongozo wa jumla, si mashindano.",
    ],
    actions: [
      "Jifunze udhu (kuosha kwa kisheria) na uufanyie mazoezi mpaka uwe wa kawaida kwako.",
      "Jifunze maneno ya lazima ya swala moja kamili ukitumia mwongozo wa matamshi.",
      "Anza kuswali swala tano za kila siku, hata kama si kikamilifu mwanzoni — uthabiti ni muhimu zaidi kuliko ukamilifu katika hatua za mwanzo.",
      "Jifunze dua chache fupi za kila siku za kuamka, kula na kutoka nyumbani.",
      "Tafuta msikiti wa eneo lako au jamii ya mtandaoni kwa msaada na maswali.",
      "Anza kusoma tafsiri ya Qur'ani, kidogo kila siku.",
      "Mwambie mtu unayemwamini — familia au rafiki wa karibu — utakapohisi uko tayari, kwa mwendo wako mwenyewe.",
    ],
  },
  {
    title: "Kupata Jamii",
    summary:
      "Kujifunza pamoja na Waislamu wengine hufanya safari kuwa rahisi na yenye furaha zaidi.",
    body: [
      "Uislamu unakusudiwa kuishiwa katika jamii, si faraghani tu. Swala ya jamaa, msikiti wa eneo lako na marafiki Waislamu wanaweza kujibu maswali ya kila siku ('nisemeje hili katika swala nikisahau?'), kutoa moyo, na kukufanya tu usijihisi peke yako katika uzoefu mpya.",
      "Ikiwa huna uhakika uanzie wapi, misikiti mingi huwakaribisha Waislamu wapya kwa ukarimu na mara nyingi huwa na mtu anayefurahi hasa kuwasaidia wageni katika mambo ya msingi — kuuliza ni jambo la kawaida na linalotarajiwa, si la aibu.",
      "Ikiwa msikiti wa ana kwa ana haupatikani kwa sasa, jamii za mtandaoni na miongozo ya programu hii vinaweza kuziba pengo hadi utakapoupata, au kwa kudumu ikiwa hiyo ndiyo hali yako — kwa vyovyote vile, bado wewe ni sehemu kamili ya jamii pana ya Waislamu (umma).",
    ],
    actions: [
      "Tafuta misikiti au vituo vya Kiislamu vilivyo karibu nawe na fikiria kuvitembelea wakati wa swala au tukio fulani.",
      "Ikiwa jamii ya ana kwa ana bado haipatikani, tafuta jamii ya Waislamu mtandaoni inayosimamiwa vizuri kwa msaada.",
    ],
  },
  {
    title: "Kuendelea Kujifunza",
    summary:
      "Mwongozo huu ni mahali pa kuanzia — miongozo mitatu ya kina iko tayari utakapokuwa tayari.",
    body: [
      "Mambo ya msingi katika mwongozo huu yakishakuwa mepesi kwako, miongozo mitatu shirikishi katika programu hii imeandaliwa kukupeleka ndani zaidi: Aqeedah kwa maelezo kamili ya kila nguzo ya imani, Jifunze Dua kwa dua za nyakati za kila siku, na msomaji wa Qur'ani kwa usomaji na tafakuri ya kila siku.",
      "Huhitaji kumaliza yoyote kati yake haraka. Uislamu hujifunzwa maisha yote, na kurudi kwenye mada ile ile miezi au miaka baadaye, ukiwa na uzoefu zaidi, ni jambo la kawaida kabisa — hata linalotarajiwa.",
    ],
    appLinks: [{ label: "Jifunze Aqeedah" }, { label: "Jifunze Dua" }, { label: "Soma Qur'ani" }],
  },
  {
    title: "Maswali: Makosa ya Kawaida ya Mwanzo",
    summary:
      "Kila mtu huanza bila ukamilifu — hivi ndivyo ya kufikiria kuhusu kujikwaa kwa mwanzo.",
    body: [
      "S: Ninaendelea kukosea sehemu za swala au kusahau maneno — je, hilo ni tatizo? J: Hapana. Kila mtu husahau maneno na kuchanganya hatua anapojifunza; endelea kufanya mazoezi kwa mwongozo wa matamshi na itakuwa ya kawaida ndani ya wiki chache. Ikhlasi wakati wa kujifunza ni muhimu zaidi sana kuliko ukamilifu wa mapema.",
      "S: Najihisi na hatia kwamba sifanyi kila kitu (saumu, swala za ziada, kuhifadhi Qur'ani) mara moja. J: Kujaribu kufanya kila kitu kwa mara moja ni kosa la kawaida la Waislamu wapya ambalo mara nyingi husababisha uchovu na kukata tamaa. Jenga swala tano za kila siku kama tabia yako ya kwanza thabiti, kisha ongeza polepole — Allah hamkalifishi mtu yeyote zaidi ya uwezo wake.",
      "S: Je, nikikosa swala au nikifanya kosa ndani yake? J: Kukosa swala mara moja moja wakati unajifunza utaratibu, au kufanya kosa dogo ndani yake, si mwisho wa dunia — ilipe utakapokumbuka, endelea, na usiache kikwazo kikuzuie kuswali swala inayofuata.",
    ],
    actions: [
      "Unapofanya kosa, lichukulie kama sehemu ya kawaida ya kujifunza, si sababu ya kukata tamaa.",
    ],
  },
  {
    title: "Maswali: Je, Nahitaji Kujifunza Kiarabu?",
    summary: "Kiarabu hukua pamoja nawe kwa miaka — si sharti la kuanza kutekeleza ibada.",
    body: [
      "S: Je, nahitaji kuzungumza Kiarabu kabla ya kuweza kuswali au kusoma Qur'ani? J: Hapana. Unaweza kuanza kuswali leo kwa maneno machache mafupi yaliyoandikwa kwa herufi za Kilatini, na kusoma Qur'ani kwa lugha yako huku usomaji wako wa Kiarabu ukikua kwa muda kupitia kurudiarudia.",
      "S: Je, ni kukosa heshima kutamka Kiarabu vibaya wakati wa kujifunza? J: Hapana — kila msomaji, katika kila kizazi, alianza akiwa mwanafunzi. Juhudi wakati wa kujifunza zinathaminiwa; ukamilifu ni lengo la muda mrefu, si sharti la kuanzia.",
      "S: Je, nijiunge na darasa la kujifunza kusoma Kiarabu (kwa ajili ya swala, si lazima kwa mazungumzo)? J: Waislamu wengi wapya huona darasa fupi la kusoma Qur'ani (misingi ya tajwidi) kuwa la manufaa sana mara mambo ya msingi ya swala yanapokuwa mepesi — ni hatua nzuri inayofuata, si ya kwanza.",
    ],
    actions: [
      "Endelea kutumia herufi za Kilatini na tafsiri pamoja na Kiarabu mpaka usomaji uwe wa kawaida — hakuna tarehe ya mwisho.",
    ],
  },
  {
    title: "Maswali: Familia na Mahusiano",
    summary: "Wema kwa familia unabaki kuwa wajibu, hata pale ambapo imani sasa zinatofautiana.",
    body: [
      "S: Familia yangu si Waislamu na nina wasiwasi kuhusu watakavyopokea — Uislamu unanitaka nini hapa? J: Wema kwa wazazi na familia umeamrishwa katika Qur'ani hata pale ambapo imani inatofautiana: 'basi usiwatii … Na suhubiana nao ulimwenguni kwa wema.' Imani yako mpya inapaswa kwa uwazi kukufanya mpole zaidi na mwenye kutimiza wajibu zaidi kwa familia, si kinyume chake.",
      "S: Niiambieje familia yangu, au nishughulikie kutokubaliana, bila kugeuka kuwa mgogoro? J: Hakuna njia moja sahihi — kasi, wakati, na kiasi cha kushiriki hutegemea familia yako mahususi na usalama wako. Huu ni uamuzi wa kibinafsi kweli; kulijadili na imamu wa eneo lako unayemwamini, mshauri, au kikundi chenye uzoefu cha kuwasaidia Waislamu wapya kabla ya mazungumzo magumu ni busara zaidi kuliko kulipitia peke yako kabisa.",
      "S: Je, ni lazima nikate uhusiano na familia au marafiki wasio Waislamu? J: Hapana — kudumisha mahusiano mazuri na kuunga udugu kunabaki kuwa wajibu katika Uislamu. Mipaka kuhusu desturi maalumu (kwa mfano, sherehe au shughuli fulani) ni jambo tofauti na la kibinafsi, linalojadiliwa vizuri zaidi na mwalimu wa eneo lako mwenye elimu anayeijua hali yako.",
    ],
    disclaimer:
      "Maswali haya yanatoa mwongozo wa jumla, usio fatwa, kwa maswali ya kawaida ya mwanzo. Kwa hali yako mahususi ya familia, usalama au mambo ya kibinafsi, tafadhali zungumza na imamu wa eneo lako, mshauri aliyehitimu, au mzee wa jamii unayemwamini.",
  },
];
