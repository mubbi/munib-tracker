import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// sw overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Fedha za Kiislamu ni Nini?",
    summary:
      "Mtazamo wa kimaadili kuhusu pesa, si aina tofauti ya bidhaa — mwongozo huu ni wa kielimu tu.",
    body: [
      "Fedha za Kiislamu si chapa ya bidhaa za uwekezaji; ni matumizi ya maadili ya Kiislamu katika jinsi pesa inavyochumwa, kukopeshwa, kutumiwa na kutolewa. Kiini chake ni kanuni chache: mali ni amana kutoka kwa Allah badala ya kuwa lengo lenyewe, miamala lazima iwe huru dhidi ya unyonyaji na kutokuwa na uhakika kupita kiasi, na faida inapaswa kufungamana na shughuli halisi za kiuchumi na kugawana hatari badala ya malipo yaliyohakikishwa juu ya mkopo.",
      "Mwongozo huu unatambulisha kanuni hizo katika ngazi ya jumla na ya kielimu: uharamu wa riba (riba/faida ya mkopo), uadilifu katika biashara, wajibu wa Zaka na sadaka ya hiari, na dhana ya msingi ya takaful (bima ya ushirikiano). Kwa makusudi haichuji mifuko ya uwekezaji, haiorodheshi hisa wala ETF, wala haipendekezi bidhaa au mtoa huduma yeyote mahususi.",
      "Bidhaa za kisasa za kifedha (mikopo ya nyumba, kadi za mkopo, sera za bima, akaunti za kustaafu, na zaidi) zimeundwa kwa njia nyingi tofauti, na hukumu juu yake zinaweza kutegemea masharti halisi ya mkataba na nchi unayoishi. Mwongozo huu unakupa kanuni za msingi; kwa hukumu kuhusu hali yako mahususi, zungumza na mwanachuoni au taasisi ya fedha za Kiislamu iliyohitimu na kuthibitishwa.",
    ],
    disclaimer:
      "Maudhui ya kielimu tu — si ushauri wa kifedha wala fatwa. Hayapendekezi, kuchuja wala kutathmini mfuko, hisa, mtoa huduma au bidhaa yoyote mahususi ya kifedha.",
  },
  {
    title: "Mali kama Amana",
    summary:
      "Kila unachomiliki hatimaye ni cha Allah — wewe ni msimamizi wake, si mmiliki wake wa mwisho.",
    body: [
      "Mada inayojirudia katika Qur'ani ni kwamba mali ni ya Allah kwanza; mtu ni mdhamini wake tu (amana) kwa muda, atakayeulizwa jinsi alivyoichuma na jinsi alivyoitumia. Hili linabadilisha mtazamo wa pesa kutoka kuwa milki ya kibinafsi tu hadi kuwa kitu utakachoulizwa kuhusu — ilitoka wapi na ilikwenda wapi.",
      "Amri mbili ndizo msingi wa jinsi amana hiyo inavyotekelezwa katika kuamiliana na watu wengine: kutimiza mikataba na makubaliano kikamilifu, na kutochukua kamwe mali ya mtu mwingine kwa dhuluma, udanganyifu au unyonyaji, bali kwa biashara ya haki kwa kuridhiana tu.",
      "Zikishikiliwa pamoja, kanuni hizi ndizo sababu maadili ya kifedha ya Kiislamu yanarudi kwenye maswali yale yale machache: je, faida hii ilichumwa kupitia juhudi halisi, hatari na kuongeza thamani? Je, upande mwingine ulitendewa kwa uaminifu kamili? Na je, wajibu wowote niliojifunga nao unatimizwa?",
    ],
  },
  {
    title: "Uharamu wa Riba",
    summary:
      "Riba (faida ya mkopo/riba ya dhuluma) ni mojawapo ya miamala inayolaaniwa vikali zaidi katika Qur'ani.",
    body: [
      "Riba — mara nyingi hutafsiriwa kama faida ya mkopo au riba ya dhuluma, kwa upana ni ongezeko lolote lililopangwa awali na kuhakikishwa linalotozwa juu ya mkopo — imeharamishwa kwa lugha kali isiyo ya kawaida katika aya tano zinazofuatana za Surat al-Baqara (2:275–279), miongoni mwa maonyo makali zaidi juu ya mada yoyote moja katika Qur'ani.",
      "Kifungu hicho kinaweka tofauti ya makusudi: 'Mwenyezi Mungu … Amehalalisha biashara na Ameharamisha riba' (2:275). Biashara — kununua, kuuza na kuwekeza ambapo pande zote mbili zinagawana hatari na juhudi halisi — inasifiwa; riba, malipo yaliyowekwa yanayodaiwa bila kujali matokeo, inalaaniwa. Sura inaendelea kuwaamuru waumini kuacha kabisa riba yoyote iliyobaki, ikionya juu ya matokeo mazito kwa wanaoendelea nayo, huku ikiahidi kwamba anayetubu anaweza kubaki na rasilimali yake ya asili tu — si zaidi, si pungufu.",
      "Hili ni fundisho la msingi la kulifahamu, si orodha ya kukagua kila bidhaa ya kisasa ya kifedha mwenyewe. Kubaini kama mkataba mahususi (mkopo wa nyumba, mkopo, akaunti ya akiba) unahusisha riba kivitendo kunahitaji kupitia masharti yake halisi pamoja na mtu aliyehitimu katika fedha za Kiislamu.",
    ],
  },
  {
    title: "Kwa Nini Biashara Inatofautiana na Riba",
    summary:
      "Faida halali inafungamana na hatari na juhudi; riba ni malipo yaliyohakikishwa bila kujali matokeo.",
    body: [
      "Njia rahisi ya kuikumbuka tofauti hii: katika biashara au uwekezaji halisi, mtu anayetoa mtaji au bidhaa hushiriki katika matokeo — anaweza kupata faida, lakini pia anaweza kupata hasara, kwa sababu yuko wazi kwa utendaji halisi wa mradi. Katika mkopo wenye riba, mkopeshaji anahakikishiwa marejesho yaliyowekwa bila kujali kama mradi wa mkopaji unafanikiwa, unatatizika au unashindwa.",
      "Elimu ya kitamaduni inaliona hili kama suala la haki: mtu mwenye shida ya dharura anayekopa pesa anaweza kunaswa akalipa zaidi sana ya alichokopa, hatari yote ikiwa juu yake na hakuna juu ya mkopeshaji — hasa ule ukosefu wa uwiano unaolaaniwa na Qur'ani katika maneno 'Mwenyezi Mungu Anaiyondoa riba … Na Anazikuza sadaka' (2:276), tofauti ya moja kwa moja kati ya mali iliyojengwa kwa unyonyaji na mali inayokua kwa ukarimu.",
      "Huu ni ulinganisho wa jumla wa kielimu, si hukumu juu ya chombo chochote mahususi (baadhi ya miundo ya kisasa huchanganya biashara na ukopeshaji kwa njia tata). Mahali ambapo bidhaa mahususi iko katika wigo huu ndilo hasa aina ya swali la kupeleka kwa mwanachuoni wa fedha za Kiislamu aliyehitimu au mshauri aliyethibitishwa badala ya kuamua kwa kanuni za jumla peke yake.",
    ],
  },
  {
    title: "Jinsi Sunna Inavyoichukulia Riba kwa Uzito",
    summary:
      "Mtume ﷺ alionya kwamba kila anayehusika katika muamala wa riba anashiriki katika dhambi yake.",
    body: [
      "Zaidi ya maonyo ya Qur'ani yenyewe, Mtume ﷺ aliweka wazi kwamba jukumu la riba halimhusu tu yule anayeitoza moja kwa moja. Katika hadithi sahihi, imepokewa kwamba ﷺ alimlaani anayekula riba, anayeilipa, anayeandika mkataba wake, na mashahidi wake wawili — akisema wote ni sawa katika hilo.",
      "Somo linalotolewa kwa kawaida kutokana na hili ni la kujiepusha kwa pamoja badala ya kulaumu mtu mmoja tu: riba inachukuliwa kama kitu ambacho muamala mzima, na kila anayeshiriki ndani yake kwa kujua, anapaswa kukaa mbali nacho — si jambo la faragha tu kati ya mkopeshaji na mkopaji.",
      "Kama ilivyo kwa aya za Qur'ani, hadithi hii inathibitisha uzito wa kanuni hii; yenyewe haikuambii jinsi ya kuainisha bidhaa mahususi ya kisasa ya kifedha. Uamuzi huo ni wa wanachuoni waliohitimu wanaopitia mkataba halisi.",
    ],
  },
  {
    title: "Uaminifu katika Biashara",
    summary: "Mfanyabiashara mkweli na mwaminifu anapewa mojawapo ya daraja za juu kabisa Akhera.",
    body: [
      "Kinyume kabisa na maonyo ya riba, biashara ya uaminifu inasifiwa mara kwa mara. Mtume Muhammad ﷺ mwenyewe alifanya kazi ya biashara kabla ya utume wake na alijulikana Makka kwa lakabu al-Amin — 'Mwaminifu' — kwa uadilifu wake katika shughuli za biashara, muda mrefu kabla hajajulikana kama Mtume.",
      "Baadaye ﷺ alifundisha kwamba 'the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs' (maana kwa Kiingereza) Siku ya Kiyama — daraja la juu isivyo kawaida lililofungamanishwa na jambo la kawaida kama kuamiliana kwa haki sokoni.",
      "Kivitendo, biashara ya haki inamaanisha: kueleza bidhaa na huduma kwa usahihi, kuweka wazi kasoro zinazojulikana badala ya kuzificha, kuheshimu bei na masharti yaliyokubaliwa, na kuepuka udanganyifu, matangazo ya uongo, au kutumia vibaya ukosefu wa ujuzi wa mnunuzi au muuzaji. Hizi ndizo silika zile zile zinazojenga biashara nzuri na endelevu katika mapokeo yoyote — Uislamu unazifungamanisha pia na malipo ya milele.",
    ],
  },
  {
    title: "Kupitia Bidhaa za Kisasa za Kifedha",
    summary:
      "Mikopo ya nyumba, kadi na bima ni mambo tata kweli — mwongozo huu unaishia kwenye kanuni.",
    body: [
      "Maisha ya kisasa ya kifedha yanahusisha bidhaa ambazo vizazi vya mwanzo vya Waislamu havikuwahi kukutana nazo katika umbo lao la sasa: mikopo ya nyumba, kadi za mkopo, akaunti za kustaafu, bima, na mifuko ya uwekezaji iliyoundwa kwa njia nyingi tofauti. Kutumia kanuni za karne nyingi kwa bidhaa hizi ni kazi halisi na ya uangalifu ya kitaaluma — si kitu cha kufikia hitimisho peke yako kutoka aya chache za jumla.",
      "Kwa sababu hii, taasisi za kisasa za fedha za Kiislamu na wanachuoni waliothibitishwa hubobea hasa katika kupitia mikataba ya kisasa ili kuona kama inaendana na kanuni hizi, mara nyingi wakitoa hukumu za kina juu ya bidhaa au miundo fulani. Upitiaji huo maalumu uko nje ya wigo wa programu hii.",
      "Ikiwa unapima uamuzi halisi wa kifedha — kununua nyumba, mkopo, uwekezaji, sera ya bima — hatua ya kuwajibika inayofuata ni kushauriana na mshauri au mwanachuoni wa fedha za Kiislamu aliyehitimu na kuthibitishwa anayeweza kuangalia masharti halisi ya mkataba, si kutegemea maudhui ya jumla ya kielimu kama mwongozo huu.",
    ],
    disclaimer:
      "Programu hii haitathmini, haichuji wala haipendekezi bidhaa, mfuko au mtoa huduma yeyote mahususi wa kifedha, na mwongozo huu si mbadala wa ushauri wa kitaaluma au wa kielimu wa kidini uliohitimu kuhusu fedha zako halisi.",
  },
  {
    title: "Zaka: Ibada Kupitia Mali",
    summary:
      "Zaka ni tendo la lazima la ibada linalotekelezwa kwa pesa badala ya maneno au harakati.",
    body: [
      "Zaka — wajibu maalumu wa kila mwaka juu ya mali inayostahiki iliyozidi kiwango cha chini (nisab) — ni mojawapo ya nguzo tano za Uislamu, ikiweka utoaji katika daraja sawa na swala na saumu badala ya kuuchukulia kama ukarimu wa hiari.",
      "Qur'ani mara kwa mara huiunganisha Zaka na swala kama alama ya imani ya kweli, na inaahidi kwamba wale wanaosimamisha swala na kutoa Zaka 'wana thawabu kubwa zinazowahusu wao mbele ya Mola wao … Na hawatapatwa na woga katika Akhera yao, wala masikitiko.' Kifedha, inafanya kazi kama utaratibu wa kutakasa mali — kugawa upya sehemu ndogo na ya mara kwa mara ya mali iliyolimbikizwa kwa wenye mahitaji badala ya kuiacha ikae bila kazi milele mikononi mwa watu wachache.",
      "Kwa kuwa hesabu inategemea akiba yako mahususi, mali zako na viwango vya nisab vya eneo lako, programu hii ina mwongozo maalumu wa Zaka na kikokotoo — vitumie moja kwa moja badala ya kukadiria kutokana na kanuni za jumla hapa.",
    ],
    appLinks: [{ label: "Mwongozo wa Zaka na kikokotoo" }],
  },
  {
    title: "Sadaka: Utoaji wa Hiari",
    summary:
      "Zaidi ya Zaka ya lazima, utoaji wowote wa hiari huitwa sadaka — na kwa kweli haukugharimu kamwe.",
    body: [
      "Sadaka ni utoaji wa hiari, unaotolewa kwa kiasi chochote, wakati wowote, kwa ajili ya Allah — zaidi ya wajibu maalumu wa Zaka. Inaanzia zawadi kubwa za kifedha hadi kitu kidogo kama neno jema au kuondoa kitu cha kudhuru njiani mwa mtu, vyote vikihesabiwa kama aina za sadaka katika maandiko ya hadithi.",
      "Mojawapo ya mafundisho yenye kutia moyo zaidi kwa yeyote anayesita kutoa ni kauli ya Mtume ﷺ kwamba sadaka haipunguzi mali — jambo ambalo Qur'ani inaliunga mkono mahali pengine kwa kueleza kutoa katika njia ya Allah kama kitu ambacho Allah hukirudisha na kukilipa, si tu kitu kinachokwisha.",
      "Kivitendo, hili linabadilisha mtazamo wa ukarimu: kutoa hakushindani na usalama wako wa kifedha bali kunaelezwa kama kunaulinda na kuukuza, kwa njia ambazo hazionekani kila mara katika mizania ya hesabu.",
    ],
    appLinks: [{ label: "Mwongozo wa Zaka na sadaka" }, { label: "Malengo ya sadaka" }],
  },
  {
    title: "Takaful: Kugawana Hatari kwa Ushirikiano",
    summary: "Mtazamo wa jumla wa dhana iliyo nyuma ya mbadala wa Kiislamu wa bima ya kawaida.",
    body: [
      "Takaful (kutoka mzizi wa Kiarabu wenye maana ya kudhaminiana) ni dhana ya jumla iliyo nyuma ya mbinu za Kiislamu za ulinzi unaofanana na bima: kundi la washiriki huchangia mfuko wa pamoja, na mfuko huo hutumiwa kuwasaidia wanachama wanaopata hasara iliyolindwa, huku ziada yoyote kwa kawaida ikigawanywa kati ya washiriki au kuhamishiwa mbele badala ya kuwekwa kama faida iliyohakikishwa ya kampuni ya bima iliyo tofauti.",
      "Wazo la msingi ni kugawana hatari kwa ushirikiano badala ya kuhamisha hatari kwa malipo yaliyohakikishwa: washiriki wanaonekana kama wanasaidiana wao kwa wao, huku mwendeshaji wa mfuko kwa kawaida akifanya kazi kama meneja au wakala kwa ada badala ya kuwa yeye ndiye mbebaji wa hatari.",
      "Haya ni maelezo ya jumla ya kidhana tu. Bidhaa halisi za takaful hutofautiana sana katika muundo kati ya watoa huduma na nchi, na kutathmini kama mpango mahususi kweli umeundwa hivi kunahitaji kupitia masharti yake halisi pamoja na mwanachuoni au taasisi ya fedha za Kiislamu iliyohitimu — programu hii haipendekezi wala haitathmini mtoa huduma au mpango wowote mahususi wa takaful (au bima).",
    ],
    disclaimer:
      "Elimu ya jumla tu. Hii si pendekezo la takaful badala ya bima ya kawaida, wala la mtoa huduma au mpango wowote mahususi — shauriana na mshauri aliyehitimu kwa hali yako.",
  },
  {
    title: "Takaful na Bima ya Kawaida, Ulinganisho wa Jumla",
    summary:
      "Zote mbili zina lengo moja — kusimamia hatari — lakini zinatofautiana katika jinsi hatari hiyo inavyopangwa.",
    body: [
      "Bima ya kawaida kwa kawaida hupangwa kama mkataba ambapo mwenye sera hulipa ada (premium) na kampuni ya bima, kama upande tofauti wa kibiashara, hubeba hatari kwa malipo ya ada hiyo, mara nyingi ikiwekeza fedha za ada kwa njia zinazoweza kujumuisha vyombo vyenye riba. Baadhi ya wanachuoni wa kitamaduni walieleza wasiwasi kwamba muundo huu unagusa riba, gharar (kutokuwa na uhakika kupita kiasi kuhusu malipo), na kuhamisha hatari kwa ada maalumu badala ya kugawana hatari.",
      "Takaful ilianzishwa, kwa ujumla, kama jaribio la kushughulikia wasiwasi huo mahususi kupitia muundo wa kusaidiana na kushirikiana badala yake — ingawa wanachuoni na taasisi hutofautiana kuhusu miundo ipi hasa inafikia lengo hilo kikamilifu, na watoa huduma wa takaful wenyewe hutofautiana sana katika muundo.",
      "Kwa kuwa wasiwasi huo na miundo mbadala vinahusisha undani halisi wa kiufundi (na kwa kuwa hali za kibinafsi kama mahali, mahitaji ya kinga, na watoa huduma waliopo hutofautiana sana), ulinganisho huu unatolewa kama historia ya jumla tu — si kama hukumu juu ya sera yoyote mahususi unayoifikiria.",
    ],
    disclaimer:
      "Ulinganisho wa kielimu tu, si fatwa juu ya bima au takaful kwa ujumla wala juu ya bidhaa yoyote mahususi. Wanachuoni wana mitazamo mbalimbali kuhusu miundo ya kisasa ya bima; shauriana na mshauri aliyehitimu kwa hali yako.",
  },
  {
    title: "Maswali: Je, Huu ni Ushauri wa Kifedha?",
    summary:
      "Hapana — mwongozo huu unafundisha kanuni tu, na hauwezi kuchukua nafasi ya ushauri uliohitimu.",
    body: [
      "S: Je, naweza kutumia mwongozo huu kuamua kama mkopo, uwekezaji au bidhaa ya bima mahususi inaruhusiwa kwangu? J: Hapana. Mwongozo huu unaeleza kanuni za jumla za Kiislamu kuhusu pesa — haupitii mikataba, haupendekezi bidhaa, wala hautoi hukumu. Maamuzi mahususi ya kifedha yanapaswa kufanywa pamoja na mtaalamu wa fedha aliyehitimu na, kwa maswali ya uhalali, mwanachuoni wa fedha za Kiislamu aliyehitimu.",
      "S: Je, programu hii inatathmini au kuorodhesha hisa, mifuko au ETF halali? J: Hapana, na haitafanya hivyo kamwe kama sehemu ya mwongozo huu — kuchuja mifuko na mapendekezo ya uwekezaji viko nje ya wigo wake na vinahitaji utaalamu wa kifedha wenye leseni ambao maudhui haya hayatoi.",
      "S: Je, mwongozo huu ni fatwa? J: Hapana. Fatwa ni hukumu mahususi ya kidini inayotolewa na mwanachuoni aliyehitimu kujibu swali na muktadha mahususi. Mwongozo huu unafundisha kanuni za jumla tu; kwa hukumu halisi kuhusu hali yako, mtafute moja kwa moja mwanachuoni aliyehitimu unayemwamini.",
    ],
    disclaimer:
      "Mwongozo huu wote ni maudhui ya kielimu, si ushauri wa kifedha wala fatwa. Daima shauriana na wataalamu wa fedha na wa dini waliohitimu kwa maamuzi kuhusu pesa zako mwenyewe.",
  },
  {
    title: "Maswali: Ninapataje Chaguo Zinazoendana na Sharia?",
    summary:
      "Tafuta utaalamu uliothibitishwa, si orodha — programu hii kwa makusudi haitoi orodha.",
    body: [
      "S: Naweza kupata wapi orodha ya benki, mifuko au majukwaa ya uwekezaji halali? J: Si katika programu hii, kwa makusudi — orodha za bidhaa hubadilika kila mara, hutofautiana sana kati ya nchi, na zinahitaji ufuatiliaji endelevu wa uzingatiaji ambao taasisi maalumu tu ndizo zinaweza kuudumisha ipasavyo. Badala yake, tafuta taasisi zenye bodi halisi ya usimamizi wa Sharia yenye majina yanayojulikana na mbinu ya uzingatiaji iliyochapishwa.",
      "S: Ninajuaje kama mwanachuoni au uthibitisho ni halali? J: Tafuta wanachuoni au bodi zinazotambuliwa na vyombo vilivyoimarika vya kuweka viwango vya fedha za Kiislamu katika eneo lako au kimataifa, badala ya madai yasiyo rasmi mtandaoni. Taasisi yenye sifa njema itakuwa wazi kuhusu nani anapitia bidhaa zake na kwa namna gani.",
      "S: Nifanye nini ikiwa siwezi kupata chaguo zozote za fedha za Kiislamu ninapoishi? J: Hii ni hali halisi na ya kawaida. Ijadili na imamu au mwanachuoni wa eneo lako mwenye elimu — anaweza kukusaidia kupima chaguo zilizopo kwa hali yako mahususi, kwa kuwa mwongozo hapa unaweza kutegemea sana mbadala gani kweli upo kwako.",
    ],
    actions: [
      "Tafuta taasisi zenye bodi ya usimamizi wa Sharia iliyo wazi na yenye majina yanayojulikana badala ya kutegemea madai ya matangazo.",
    ],
  },
  {
    title: "Maswali: Mikopo ya Nyumba, Kadi na Mikopo",
    summary: "Haya ndiyo hasa maswali yanayohitaji mwanachuoni aliyehitimu, si mwongozo wa jumla.",
    body: [
      "S: Je, mkopo wa nyumba daima ni riba? J: Miundo hutofautiana — baadhi ya mikopo ya kawaida ya nyumba ni mikopo yenye riba, huku baadhi ya watoa huduma wakitoa miundo mbadala (kama ubia unaopungua au mifumo ya kukodisha hadi kumiliki) inayokusudiwa kuepuka riba. Kama bidhaa mahususi inafikia hilo kivitendo ni swali la kitaalamu kuhusu mkataba wake halisi, si jambo la kudhani upande wowote.",
      "S: Je, naweza kutumia kadi ya mkopo ikiwa daima nalipa salio lote na sijawahi kutozwa riba? J: Wanachuoni wana mitazamo tofauti kuhusu hili, kwa sehemu kwa sababu makubaliano ya msingi bado yanaweza kitaalamu kujumuisha kifungu cha riba hata kama hukiamshi kamwe kivitendo. Hili ni eneo halisi la tofauti za maoni ya wataalamu — muulize mwanachuoni unayemwamini badala ya kudhani kuna jibu moja kwa wote.",
      "S: Na vipi kuhusu mikopo ya wanafunzi au mikopo mingine ambayo huenda isiepukike katika hali fulani? J: Dharura na ugumu ni mambo halisi ambayo wanachuoni huyapima kwa uangalifu, na mitazamo hutofautiana kulingana na hali na nchi. Ikiwa unakabiliwa na uamuzi huu, peleka hali yako mahususi kwa mwanachuoni aliyehitimu badala ya kujaribu kuitatua kwa kusoma kwa jumla peke yake.",
    ],
    disclaimer:
      "Haya ni maswali yenye tofauti halisi za maoni na yanayotegemea mkataba husika. Maswali haya yanakuonyesha tu kila moja ni aina gani ya swali — hayajibu lolote kati yake kwa hali yako.",
  },
];
