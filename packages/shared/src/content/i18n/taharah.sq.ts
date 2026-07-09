// Albanian translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_SQ: DeepPartial<TaharahTopic>[] = [
  {
    title: "Hyrje në Taharah",
    summary: "Pastrimi është dera e lutjes dhe gjysma e besimit të besimtarit.",
    body: [
      'Taharah (طهارة) do të thotë pastrim - çlirim i trupit, veshjeve dhe vendit të faljes nga papastërtitë rituale dhe fizike, në mënyrë që një musliman të mund të qëndrojë para Allahut në një gjendje që Ai e pranon. Është gjëja e parë që mëson një student i adhurimit, sepse pa të asnjë lutje nuk është e vlefshme: Profeti ﷺ ka thënë: "Çelësi i namazit është pastrimi".',
      "Pastrimi në Islami ka dy dimensione. E jashtme është pastërtia e prekshme - larja, heqja e papastërtisë, mbajtja e pastër. E brendshme është përulësia, ndërgjegjja dhe gatishmëria e zemrës që larja ka për qëllim të zgjojë. Profeti ﷺ i lidhi të dy bashkë kur e quajti pastrimin 'gjysma e besimit', duke e kombinuar pastërtinë fizike me pastrimin e shpirtit nga mëkati.",
      "Ky modul e përshkon të gjithë temën sipas radhës: uji me të cilin pastroni, abdesi (abdesi i vogël), gusli (dushja e plotë rituale), tejemmumi (pastrimi i thatë kur uji nuk mund të përdoret), nexhasah (heqja e papastërtisë fizike) dhe rastet dhe lëshimet e veçanta. Mësoni atë një herë dhe lutja bëhet diçka në të cilën mund të hyni me besim dhe jo me dyshim.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kur të ngriheni për të falur namazin, lani fytyrat dhe parakrahët deri në bërryla, fshijini kokat tuaja dhe lani këmbët deri në kyçin e këmbës.",
      },
      {
        excerpt: "Vërtet, Allahu i do ata që pendohen vazhdimisht dhe i do ata që pastrohen.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Çelësi i lutjes është pastrimi; fillimi i tij është tekbiri dhe fundi i tij është teslimi. (Ali; edhe Xhemi et-Tirmidhi 3)",
      },
    ],
    actions: [
      "Trajtoje pastrimin si përgatitje për takimin me Allahun, jo si një rutinë të nxituar.",
      "Studioni një temë taharah çdo ditë derisa e gjithë rrjedha të duket e natyrshme.",
    ],
    appLinks: [{}],
  },
  {
    title: "Rëndësia e pastërtisë",
    summary: "Pastërtia është kusht i rreptë i namazit dhe shenjë e besimtarit.",
    body: [
      "Pastrimi nuk është një nga opsionet e shumta - ai është kusht për vlefshmërinë e namazit. Allahu nuk e pranon lutjen e një personi që është në gjendje të papastërtisë rituale derisa të pastrohet. Kjo është arsyeja pse namazi i kryer pa abdes apo gusl të vlefshëm duhet të përsëritet, sado i sinqertë të jetë.",
      'Profeti ﷺ e ngriti pastrimin në një tipar përcaktues të besimtarit, duke e quajtur atë "gjysma e besimit". Pastrimi i rregullt disiplinon një person, e mban atë në një gjendje gatishmërie të vazhdueshme për të adhuruar dhe - mëson hadithi - fjalë për fjalë i lan mëkatet e vogla me ujë.',
      "Për shkak se e ruan namazin, taharaja e ruan edhe besimtarin nga mëkati i faljes së pavlefshme nga pakujdesia. Prandaj, mësimi i mirë i vendimeve të tij është një veprim i mbrojtjes së një prej veprave më të mëdha në Islami.",
    ],
    hadith: [
      {
        excerpt: "Pastrimi është gjysma e besimit. (Ebu Malik el-Esh'ari)",
      },
      {
        excerpt:
          "Allahu nuk e pranon lutjen pa pastrim, as sadaka nga ajo që është vjedhur. (Ibn Umeri)",
      },
    ],
    actions: [
      "Para çdo lutjeje, konfirmoni gjendjen tuaj të pastërtisë përpara se të filloni.",
      "Mbani një listë të thjeshtë kontrolli mendor: trupin, veshjen, vendin dhe abdesin.",
    ],
  },
  {
    title: "Llojet e pastërtisë",
    summary:
      "Tre gjendje që duhen ditur: papastërti e vogël, papastërti e madhe dhe nexhase fizike.",
    body: [
      "Ligji Islami dallon tre gjëra nga të cilat mund të keni nevojë të pastroni dhe secila ka ilaçin e vet. Të dish se në cilën situatë ndodhesh është çelësi për të zgjedhur metodën e duhur.",
      "Papastërtia e vogël rituale (hadath asghar) rezulton nga ngjarje të zakonshme si përdorimi i tualetit, era që kalon ose gjumi i thellë. Ai hiqet me abdes, ose me tejemum kur uji nuk mund të përdoret.",
      "Papastërtia e madhe rituale (hadet ekber, i quajtur edhe xhenabe) rezulton nga intimiteti, shkarkimi seksual dhe përfundimi i menstruacioneve ose gjakderdhja pas lindjes. Ai hiqet me gusl, banjë rituale e të gjithë trupit - me tejemum që zëvendësohet përsëri kur uji është i padisponueshëm ose i dëmshëm.",
      "Fëlliqësia fizike (nexhasah) - si urina, jashtëqitjet ose gjaku që rrjedh - është një çështje më vete: ajo duhet të hiqet fizikisht nga trupi, rrobat dhe vendi i faljes, pavarësisht nga gjendja juaj rituale. Katër shkollat ​​sunite bien dakord për këto tre kategori, duke u dalluar vetëm në disa detaje të asaj që e anulon pastërtinë ose çfarë sasie gjurmë justifikohen.",
    ],
    quran: [
      {
        excerpt:
          "E nëse jeni në gjendje xhenabeje, atëherë pastroni veten. Por nëse jeni i sëmurë ose jeni në udhëtim… dhe nuk gjeni ujë, atëherë bëni tejemmum me tokë të pastër.",
      },
    ],
    actions: [
      "Identifikoni së pari gjendjen tuaj (të vogla, të mëdha ose të ndyra), më pas aplikoni metodën e duhur.",
      "Kur nuk jeni të sigurt për detajet, ndiqni vazhdimisht një mësues të kualifikuar nga një shkollë e njohur.",
    ],
  },
  {
    title: "Uji në Islami",
    summary:
      "Uji i pastër është pastruesi kryesor - përdoret tërësisht, por nuk shpërdorohet kurrë.",
    body: [
      "Mjeti i paracaktuar i pastrimit është uji. Allahu e përshkruan shiun si të zbritur 'të pastër' (tahur) - i aftë për të pastruar dhe për t'u përdorur për adhurim. Çdo ujë natyralisht i pastër - shiu, lumi, deti, burimi, pusi ose rubineti - pastrohet për sa kohë që ngjyra, shija ose aroma e tij nuk janë ndryshuar nga një papastërti që përzihet në të.",
      "Juristët e kategorizojnë ujin në detaje (i pastër dhe pastrues, i pastër por jo pastrues dhe i papastër), por rregulli praktik për jetën e përditshme është i thjeshtë: uji mbetet i përshtatshëm për abdes dhe gusl, përveç nëse një nexhase e ka ndryshuar qartë atë. Kur jeni në dyshim të vërtetë me një alternativë të pastër të disponueshme, përdorni alternativën.",
      "Islami mëson tërësinë pa ekstravagancë. Profeti ﷺ lau plotësisht, por përdori jashtëzakonisht pak ujë - rreth një baltë (dy grushte të mbushura me gota) për abdes dhe një sa' (afërsisht katër) për një gusl të plotë. Shpërdorimi i ujit dekurajohet edhe kur është i bollshëm, sepse vetë moderimi është pjesë e mirësjelljes së adhurimit.",
    ],
    quran: [
      {
        excerpt: "Dhe Ne lëshojmë nga qielli ujë të pastër.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pejgamberi ﷺ merrte abdes me baltë ujë dhe gusl me sa' deri në pesë baltë. (Enes; gjithashtu Sahih Mysliman 325 - suneti i moderuar)",
      },
    ],
    actions: [
      "Përdorni ujë të mjaftueshëm për t'u larë plotësisht, por kthejeni rubinetin poshtë dhe shmangni tepricat.",
      "Nëse një burim uji duket ose ka erë të ndryshuar nga papastërtia, kërkoni burimin më të afërt qartësisht të pastër.",
    ],
    disclaimer:
      "Raporti i shumëcituar 'mos e shpërdoroni ujin edhe në një lumë që rrjedh' (Ibn Maxhe 425) vlerësohet i dobët (da'if) nga shumica e dijetarëve; sunneti i moderimit vendoset në vend të kësaj nga hadithi mudd/sa' i mësipërm.",
  },
  {
    title: "Çfarë është Wudu?",
    summary: "Abdesi ritual që heq papastërtitë e vogla para adhurimit.",
    body: [
      "Abdesi (وضوء) është larja rituale e gjymtyrëve të veçanta, në një rend të caktuar, që heq papastërtitë e vogla rituale. Katër larjet e detyrueshme të tij janë emërtuar drejtpërdrejt në Kuran (5:6): fytyra, parakrahët deri në bërryla, fshirja e kokës dhe këmbët deri te kyçet.",
      "Kërkohet para çdo namazi - përveç nëse qëndroni në një gjendje të vlefshme nga namazi i mëparshëm - dhe, sipas shumicës së dijetarëve, para kryerjes së tavafit rreth Qabes dhe para se të prekni tekstin fizik (mushafin) të Kur'anit.",
      'Abdesi është një akt adhurimi më vete, jo thjesht një akt paraprak. Pejgamberi ﷺ paralajmëroi se "Allahu nuk ia pranon lutjen asnjërit prej jush që e prish abdesin derisa ai të marrë përsëri abdes" - kështu që ruajtja e tij është ruajtja e vetë namazit.',
    ],
    hadith: [
      {
        excerpt:
          "Allahu nuk ia pranon lutjen njërit prej jush që e ndërpret abdesin derisa të marrë abdes. (Ebu Hurejre)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kushtet për abdes të vlefshëm",
    summary:
      "Qëllimi, uji i pastër dhe lëkura e papenguar - parakushtet për një abdes të shëndoshë.",
    body: [
      "Duhet të ekzistojnë disa kushte (shurut) që abdesi të numërohet. Personi duhet të jetë musliman me mendje të shëndoshë, me qëllim pastrimin për adhurim (nijet). Disa shkolla e klasifikojnë qëllimin si shtyllë të veprës dhe të tjera si kusht, por të gjithë pajtohen se ai kërkohet për shpërblimin dhe, për shumicën, për vlefshmërinë.",
      "Uji i përdorur duhet të jetë i pastër dhe pastrues. Më e rëndësishmja, ajo duhet të arrijë në lëkurë - kështu që çdo gjë që formon një barrierë të papërshkueshme nga uji mbi një gjymtyrë (bojë e trashë, manikyr thonjve, dyll, ngjitës) duhet të hiqet së pari, ose larja poshtë saj nuk është e vlefshme. Papastërtia e zakonshme ose njolla këna që nuk bllokon ujin nuk është problem.",
      "Shkollat ​​Shafi'ite dhe Hanbelite gjithashtu kërkojnë që larjet të bëhen sipas rendit Kur'anor dhe pa ndërprerje të gjatë (muvalat) që lejon që gjymtyrët të thahen. Pozicioni Hanefi dhe Maliki për sekuencën dhe vazhdimësinë strikte janë më të buta në disa situata. Ndiqni metodën e një shkolle për qëndrueshmëri.",
    ],
    quran: [
      {
        excerpt:
          "Lani fytyrat dhe parakrahët deri në bërryla, fshijini kokat dhe lani këmbët deri te kyçet.",
      },
    ],
    actions: [
      "Hiqni manikyrin e thonjve, unazat që bllokojnë ujin dhe çdo gjë që mbyll lëkurën përpara abdesit.",
      "Merrni abdes me qetësi në një rrjedhë në mënyrë që asnjë gjymtyrë të mos humbasë ose të lihet të thahet.",
    ],
  },
  {
    title: "Veprat e detyrueshme të abdesit",
    summary: "Shtyllat Kur'anore (feraid) pa të cilat abdesi është i pavlefshëm.",
    body: [
      "Veprat e detyrueshme të abdesit (faraidit të tij) janë pjesët që Allahu i ka emërtuar në ajetin: larja e tërë fytyrës; larja e të dy krahëve deri në bërryla dhe duke përfshirë; fshirja e kokës; dhe larja e të dyja këmbëve deri dhe duke përfshirë kyçet. Mungoni ndonjë nga këto dhe abdesi është i paplotë.",
      "Këtyre shkollat ​​shtojnë obligime të tjera nga Suneti dhe arsyetimi juridik. Nijeti është i detyrueshëm në shumicën e shkollave (hanefitë e klasifikojnë atë si një sunet i theksuar fort për heqjen e papastërtive të vogla). Rendi (tartib) dhe vazhdimësia (muvalat) janë të detyrueshme për shafiitë dhe hanbelitë. Malikitë shtojnë si obligim fërkimin e gjymtyrëve (dalk).",
      "Çdo gjë përtej këtyre – shpëlarja e gojës dhe hundës, larja e duarve në fillim, larja tri herë – rekomandohet (suneh) dhe jo obligim. Njohja e ndryshimit do të thotë që ju mund të dalloni kur një abdes është thjesht i papërsosur kundrejt faktit të pavlefshëm.",
    ],
    quran: [
      {
        excerpt:
          "Lani fytyrat dhe parakrahët deri në bërryla, fshijini kokat dhe lani këmbët deri te kyçet.",
      },
    ],
    disclaimer:
      "Lista e saktë e faraideve (p.sh. nëse qëllimi, porosia dhe fërkimi janë të detyrueshme) ndryshon midis katër shkollave. Mësoni dhe aplikoni vazhdimisht një shkollë të besueshme.",
  },
  {
    title: "Veprat e Sunetit të Abdesit",
    summary: "Veprat e rekomanduara që përsosin dhe shumëfishojnë shpërblimin e abdesit.",
    body: [
      "Rreth bërthamës së detyrueshme, Profeti salAllahu alejhi ue selem praktikoi shumë vepra të rekomanduara (sunetin) që plotësojnë dhe zbukurojnë abdesin. Lënia nuk e prish abdesin, por përfshirja e tyre fiton shpërblim shtesë dhe ndjek shembullin e tij më plotësisht.",
      "Veprat e vendosura të sunetit përfshijnë: thënien 'Bismilah' në fillim; larja e duarve tre herë para fillimit; shpëlarja e gojës (madmadah) dhe hundës (istinshaq); kalimi i gishtave të lagur nëpër një mjekër të trashë dhe midis gishtërinjve dhe këmbëve (takhlil); duke filluar çdo palë gjymtyrësh me të djathtën; dhe duke e përsëritur çdo larje deri në tre herë.",
      "Dy sunete meritojnë përmendje të veçantë: përdorimi i misvakut (sivakut) paraprakisht - të cilin Profeti ﷺ gati e bëri obligim - dhe leximi i dëshmisë së besimit pas përfundimit, i cili hap tetë dyert e Xhenetit për atë që e thotë atë.",
    ],
    hadith: [
      {
        excerpt:
          'Kushdo që merr abdes mirë, pastaj thotë: "Dëshmoj se nuk ka zot tjetër përveç Allahut... dhe se Muhamedi është rob dhe i Dërguar i Tij", atij i hapen tetë dyert e Xhenetit. (Omer ibn el-Hattab)',
      },
    ],
    actions: [
      "Praktikoni sekuencën e plotë të sunetit derisa të bëhet rutina juaj natyrale.",
      "Recitoni shehadetin pas abdesit çdo herë.",
    ],
    appLinks: [{}],
  },
  {
    title: "Abdes hap pas hapi",
    summary: "Sekuenca e plotë profetike nga nijeti deri te lutja mbyllëse.",
    body: [
      "Profeti ﷺ e mësoi abdesin si një sekuencë rrjedhëse që i bashkon obligimet së bashku me veprat e sunetit. Kjo është metoda që Uthman ibn Affani ua tregoi njerëzve, duke thënë më pas se ai e kishte parë Profetin ﷺ duke marrë abdes pikërisht kështu - dhe se kushdo që bën të njëjtën gjë dhe fal dy rekate me prani të plotë, i falen mëkatet e kaluara.",
      "Kryeni çdo hap pa nxitim, duke u siguruar që uji të arrijë në çdo zonë të kërkuar. Gjymtyrët e lara (fytyra, krahët, këmbët) lahen; koka vetëm fshihet.",
    ],
    steps: [
      {
        title: "Kini për qëllim pastrimin dhe thoni Bismilah",
        body: "Vendose nijetin për abdes në zemrën tënde dhe fillo me emrin e Allahut.",
        tip: "Synimi është i brendshëm - nuk kërkohet asnjë formulë e folur.",
      },
      {
        title: "Lani të dyja duart tri herë",
        body: "Lani deri te kyçet, duke kaluar ujë mes gishtave.",
      },
      {
        title: "Shpëlajeni gojën tri herë",
        body: "Merrni ujë në gojë, rrotullojeni dhe nxirreni.",
      },
      {
        title: "Shpëlajeni hundën tri herë",
        body: "Hidhni ujë butësisht në vrimat e hundës dhe fryeni atë.",
      },
      {
        title: "Lajeni fytyrën tri herë (farz)",
        body: "Nga vija e flokëve tek poshtë mjekrës dhe nga veshi në vesh.",
      },
      {
        title: "Lani krahun e djathtë, pastaj të majtën (farz)",
        body: "Secili nga majat e gishtave deri në bërryl dhe duke përfshirë, deri në tre herë.",
      },
      {
        title: "Fshijeni kokën një herë (farz)",
        body: "Me duar të lagura, fshijeni nga përpara në mbrapa dhe kthehuni, më pas fshijini veshët me të njëjtën lagështirë.",
      },
      {
        title: "Lani këmbën e djathtë, pastaj të majtën (farz)",
        body: "Secili në dhe duke përfshirë kyçin e këmbës, duke kaluar gishtat midis gishtërinjve.",
        tip: "Kushtojini vëmendje thembrave dhe kyçeve të këmbëve - pikat më të humbura.",
      },
      {
        title: "Lexoni lutjen e mbylljes",
        body: "Thuaj dëshminë e besimit për të hapur dyert e Xhenetit.",
        tip: "Një sunet i shkurtër por shumë i shpërblyer.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Osmani lau çdo gjymtyrë tri herë siç e kishte parë Pejgamberin ﷺ të bënte, pastaj tha: Kushdo që merr abdes në këtë mënyrë dhe fal dy rekate me fokus të plotë, atij i falen mëkatet e kaluara. (Humran, nga Osmani)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duat që lidhen me abdesin",
    summary: "Lutjet e raportuara autentikisht para dhe pas abdesit.",
    body: [
      "Përkujtimet më të forta të transmetuara rreth abdesit janë dy: thënia \"Bismilah\" në fillim dhe dëshmia e besimit pas përfundimit të saj. Shehadetit përmbyllës, një shtesë autentike i kërkon Allahut: 'Më bëj ndër ata që pendohen dhe më bëj ndër ata që pastrohen'.",
      "Është e rëndësishme të dihet se 'duaja e hollësishme për çdo gjymtyrë' (një lutje specifike gjatë larjes së duarve, fytyrës, krahëve etj.) që qarkullon në disa broshura nuk është vërtetuar me autenticitet të shëndoshë nga Profeti ﷺ. Dijetarët këshillojnë që këto të mos i atribuohen atij si sunet, ndërkohë që nuk ka dëm në përkujtimin e përgjithshëm të Allahut gjatë abdesit.",
      "Thelbi i çështjes është prania: lahuni me vetëdije se mëkatet e çdo gjymtyre po bien dhe përfundoni me shehadetin që rilidh veprën me qëllimin e tij - besimin vetëm në Allahun.",
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që merr abdes mirë dhe pastaj lexon dëshminë e besimit, atij i hapen tetë dyert e Xhenetit që të hyjë nga ku të dojë. ('Umar)",
      },
    ],
    actions: [
      "Mësoni përmendësh shehadetin pas abdesit nëse nuk e keni bërë tashmë.",
      "Shmangni recitimin e formulave të paverifikuara për gjymtyrë sikur të ishin sunet i vendosur.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Çfarë e prish abdesin?",
    summary: "Anuluesit e abdesit - dhe rregulli i sigurisë kur dyshoni.",
    body: [
      "Sipas marrëveshjes dijetare, abdesi prishet nga çdo gjë që del nga dy rrugët private - urina, jashtëqitja, era ose rrjedhje tjetër - si dhe nga gjumi i thellë që heq vetëdijen dhe nga humbja e vetëdijes nga të fikëtit ose dehja.",
      "Çështje të tjera i nënshtrohen dallimeve respektuese midis shkollave: prekja drejtpërdrejt e pjesëve intime dhe kontakti lëkurë më lëkurë me një jomahram të seksit të kundërt, janë anulues në disa shkolla, por jo në të tjera, bazuar në leximet e ndryshme të të njëjtave tekste.",
      'Një parim jetik qeverisës ju mbron nga ankthi i vazhdueshëm (waswas): siguria nuk hiqet nga dyshimi. Nëse keni marrë abdes dhe nuk jeni thjesht i sigurt nëse e keni prishur atë, ju ende konsideroheni se keni marrë abdes derisa të jeni të sigurt se ka ndodhur një anulues. Profeti ﷺ i tha një njeriu të shqetësuar nga kjo ndjenjë që të mos e lërë namazin e tij "derisa të dëgjojë një zë ose të gjejë një erë".',
    ],
    hadith: [
      {
        excerpt:
          "Ai nuk duhet të largohet (namazin e tij) derisa të dëgjojë një zë ose të gjejë një erë. (Abbad ibn Temim, nga xhaxhai i tij)",
      },
    ],
    disclaimer:
      "Nëse prekja e seksit të kundërt apo pjesëve intime e prish abdesin ndryshon mes shkollave. Ndiqni një mësues të kualifikuar vendas dhe metodën e një shkolle.",
  },
  {
    title: "Gabimet e zakonshme të abdesit",
    summary: "Gabimet e shpeshta që zvogëlojnë shpërblimin - ose e zhvlerësojnë abdesin tërësisht.",
    body: [
      "Shumica e gabimeve të abdesit vijnë nga nxitimi. Nxitimi në mënyrë që uji të mos arrijë në një gjymtyrë të tërë - një copë e thatë në thembër, kyçin e këmbës, bërryl ose midis gishtërinjve dhe këmbëve - mund ta lërë abdesin të pavlefshëm, sepse larja kur'anore nuk ka përfunduar atje.",
      'Pejgamberi salAllahu alejhi ue selem pa njerëz, thembrat e të cilëve u lanë të thata pasi uji nuk u kishte arritur, dhe paralajmëroi ashpër: "Mjerë thembra nga zjarri!" Thembrat, kyçet dhe qoshet e fytyrës janë pikat më të neglizhuara.',
      "Gabimi i kundërt është teprimi: larja shumë më tepër se tre herë, ose përdorimi i ujit në mënyrë të kotë, gjë që bie ndesh me sunetin e maturisë. Të tjerët bien në waswas (dyshim obsesiv), duke e përsëritur abdesin vazhdimisht - edhe ky është një gabim, pasi siguria nuk përmbyset nga dyshimi.",
    ],
    hadith: [
      {
        excerpt:
          "Mjerë thembrat nga zjarri! - tha kur pa takat e mbetura të thata në abdes. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Ngadalësoni dhe konfirmoni me vetëdije mbulimin e plotë të çdo gjymtyre të larë, veçanërisht thembrat dhe bërrylat.",
      "Përdorni ujë të moderuar; mos lejoni që dyshimi obsesiv t'ju shtyjë në përsëritje të panevojshme.",
    ],
  },
  {
    title: "Virtytet e abdesit",
    summary:
      "Abdesi i fshin mëkatet, i ngre gradët dhe do t'i bëjë besimtarët të shkëlqejnë në Ditën e Gjykimit.",
    body: [
      "Abdesi është një larje e përsëritur e mëkateve. Profeti ﷺ mësoi se ndërsa një besimtar lan çdo gjymtyrë, veprimet e gabuara të kryera nga ajo gjymtyrë bien me ujë - me sytë, duart, këmbët - derisa personi të dalë i pastruar nga mëkati. Një lutje e paraprirë nga abdesi i paraprin kështu një falje e re.",
      "Është edhe një nder dallues në jetën tjetër. Në Ditën e Kiametit, Profeti ﷺ do t'i njohë ndjekësit e tij me anë të shkëlqimit në fytyrat, duart dhe këmbët e tyre nga gjurmët e abdesit - një dritë unike për këtë ummet, e quajtur el-gurr el-muhaxhalun.",
      "Për shkak të këtyre virtyteve, qëndrimi në gjendje të abdesit është zakon i rekomanduar: ripërtëritja e tij për çdo namaz dhe fjetja me abdes, janë nga rutinat mbrojtëse të besimtarit.",
    ],
    hadith: [
      {
        excerpt:
          "Umeti im do të thirret në Ditën e Kijametit me fytyra, duar dhe këmbë të shndritshme nga gjurmët e abdesit. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Rinovoni abdesin për çdo dritare lutjeje ku mundeni.",
      "Bëjeni gjumin me abdes një sunet të natës.",
    ],
    appLinks: [{}],
  },
  {
    title: "Çfarë është Gusli?",
    summary: "Banja rituale e të gjithë trupit që heq papastërtitë e mëdha (xhenabe).",
    body: [
      "Gusl (غسل) është larja rituale e të gjithë trupit, me qëllim, për të hequr papastërtinë e madhe rituale (xhenabe). Aty ku abdesi trajton papastërtitë e vogla, gusli trajton gjendjen më të madhe që pason intimitetin, shkarkimin seksual dhe përfundimin e menstruacioneve ose gjakderdhjes pas lindjes.",
      "Thelbi i tij është se uji arrin në çdo pjesë të trupit të jashtëm - nuk mund të mbetet asnjë pikë e thatë, duke përfshirë rrënjët e flokëve, palosjet e lëkurës, pas veshëve, kërthizës dhe midis gishtërinjve. Shpëlarja e gojës dhe e hundës është përfshirë në gusl nga shumë dijetarë.",
      "Një gusl i vetëm i kryer me qëllim të heqjes së xhenabes gjithashtu largon papastërtitë e vogla, kështu që një person që ka përfunduar guslin mund të falet pa abdes të veçantë (edhe pse marrja e abdesit brenda guslit është sunet).",
    ],
    quran: [
      {
        excerpt: "E nëse jeni në gjendje xhenabeje, atëherë pastroni veten.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kur kërkohet gusl",
    summary: "Situatat që e bëjnë banjën e plotë rituale të detyrueshme ose të rekomandueshme.",
    body: [
      "Gusli bëhet i detyrueshëm (farz) në disa raste të përcaktuara: lëshimi i lëngjeve seksuale me dëshirë (qoftë i zgjuar apo përmes një ëndrre të lagësht); Vetë marrëdhëniet seksuale, edhe pa ejakulim - Pejgamberi salAllahu alejhi ue selem ka thënë se pasi të bashkohen të dyja, bëhet gusli; dhe përfundimi i menstruacioneve (hajd) ose gjakderdhja pas lindjes (nifas). Vdekja gjithashtu e obligon guslin e të ndjerit ndaj të gjallëve.",
      "Guslet e tjera janë të rekomanduara (mustehab) dhe jo të detyrueshme: gusli për ditën e xhuma para xhumasë, i cili nxitet aq fort sa Profeti (sal-lAllahu alejhi ue sel-lem) e quajti atë 'detyrë për çdo njeri që ka arritur pubertetin'; gusli për dy bajramet; dhe guslin e ihramit para haxhit apo umres.",
      "Një musliman i ri udhëzohet të kryejë gusl me hyrjen në Islami - i obliguar nga disa dijetarë dhe i rekomanduar fuqishëm nga të tjerët.",
    ],
    hadith: [
      {
        excerpt:
          "Kur një burrë ulet në mes të katër gjymtyrëve të gruas së tij dhe kryen marrëdhënie me të, gusli bëhet i detyrueshëm. (Ebu Hurejre; gjithashtu Sahih Mysliman 348)",
      },
      {
        excerpt:
          "Gusli i xhumasë është detyrë për çdo person që ka arritur moshën e pubertetit. (Ebu Seid el-Khudri; gjithashtu Sahih Mysliman 846)",
      },
    ],
    disclaimer:
      "Nëse gusli i xhumasë dhe i konvertimit janë të detyrueshme ose të rekomanduara fuqimisht, ndryshon nga shkolla dhe rrethanat.",
    appLinks: [{}],
  },
  {
    title: "Ghusl hap pas hapi",
    summary: "Metoda profetike - detyrimi minimal plus sunetin e plotë.",
    body: [
      "Aishja e përshkroi guslin e Profetit ﷺ në detaje dhe prej tij dijetarët nxjerrin si guslin minimal të vlefshëm ashtu edhe metodën më të plotë të sunetit. Minimumi është thjesht: qëllimi plus uji që arrin në të gjithë trupin (me shpëlarje të gojës dhe hundës për shumë njerëz). Metoda e plotë më poshtë është se si e bëri vetë Profeti ﷺ.",
      "Kryeni atë pa nxitim, duke e fërkuar ujin nëpër lëkurë në mënyrë që asgjë të mos mbetet e thatë.",
    ],
    steps: [
      {
        title: "Formoni qëllimin",
        body: "Synoni në zemrën tuaj të hiqni papastërtinë e madhe rituale (xhenabe).",
      },
      {
        title: "Thuaj Bismilah dhe laji duart",
        body: "Filloni në emër të Allahut dhe lani të dyja duart.",
      },
      {
        title: "Lani zonën private",
        body: "Largoni çdo papastërti nga pjesët intime me dorën e majtë.",
      },
      {
        title: "Kryeni abdes të plotë",
        body: "Merrni abdes si për namaz. Mund të vononi larjen e këmbëve deri në fund nëse qëndroni në ujë të grumbulluar.",
      },
      {
        title: "Hidhni ujë mbi kokë tre herë",
        body: "Punoni ujin në lëkurën e kokës dhe rrënjët e flokëve.",
      },
      {
        title: "Lani anën e djathtë, pastaj të majtën",
        body: "Hidhni dhe fërkoni ujë në të gjithë trupin, duke filluar nga e djathta.",
      },
      {
        title: "Siguroni mbulim të plotë",
        body: "Mos lini asnjë vend të thatë - nënsqetulla, kërthizë, pas gjunjëve dhe veshëve dhe midis gishtërinjve.",
        tip: "Gratë nuk duhet të zgjidhin flokët e gërshetuar, me kusht që uji të arrijë në lëkurën e kokës.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pejgamberi salAllahu alejhi ue selem, kur lahej nga xhenabeja, lante duart, merrte abdes si për namaz, kalonte gishtat nëpër flokët e tij, pastaj i derdhi ujë mbi kokën e tij tri herë dhe mbi pjesën tjetër të trupit. (Aishja)",
      },
    ],
  },
  {
    title: "Gabimet e zakonshme të guslit",
    summary: "Shmangni zonat e thata, qëllimin e munguar dhe gabimin e dushit me gusl.",
    body: [
      "Gabimi më themelor është trajtimi i një dushi të zakonshëm si gusl. Një gusl kërkon qëllimin për të hequr papastërtitë e mëdha; pa të, sado kohë të lahesh, gjendja rituale nuk hiqet. Formoni qëllimin përpara se të filloni.",
      "Gabimi i dytë i zakonshëm është lënia e pikave të thata. Detyrimi është që uji të prekë tërë trupin e jashtëm, kështu që lënia pas dore e rrënjëve të kokës, e veshëve, e kërthizës, e pjesës së pasme ose ndërmjet gishtërinjve e lë guslin të paplotë. Fërkoni ujin mbi këto zona për t'u siguruar.",
      "Për flokët: një grua me flokë të gërshetuara nuk i kërkohet t'i zgjidhë gërshetat, përderisa uji arrin deri në rrënjët e kokës - Profeti ﷺ i tha Ummu Selemes se mjafton të derdhësh tre grushte mbi kokë. Flokët e një mashkulli, duke qenë zakonisht të lëshuara, duhet të përpunohen në mënyrë që uji të arrijë në rrënjë.",
    ],
    hadith: [
      {
        excerpt:
          "Mjafton që të derdhni tre grushte ujë mbi kokën tuaj, pastaj derdhni ujë mbi veten tuaj dhe do të jeni të pastruar - nuk keni nevojë t'i zgjidhni gërshetat. (Umm Seleme)",
      },
    ],
    actions: [
      "Thuaj nijetin para derdhjes së parë, kështu që larja llogaritet si gusl.",
      "Fërkoni me ujë zona që humbasin lehtësisht; kur jeni të pasigurt, lani një pjesë në vend që të përfundoni në dyshim.",
    ],
  },
  {
    title: "Çfarë është Tejemmumi?",
    summary: "Pastrimi i thatë me tokë të pastër kur uji nuk mund të përdoret.",
    body: [
      "Tejemmumi (تیم) është zëvendësuesi i mëshirshëm i abdesit ose guslit kur uji është vërtet i padisponueshëm ose nuk mund të përdoret. Në vend të larjes, njeriu godet tokën e pastër me pëllëmbët dhe fshin fytyrën dhe duart - dhe kjo zë plotësisht vendin e pastrimit të ujit, duke lejuar lutjen e vlefshme.",
      'Tejemmumi është një dhuratë për këtë ummet në veçanti: Pejgamberi ﷺ tha: "Toka është bërë për mua një vend lutjeje dhe një mjet pastrimi", duke e renditur atë ndër privilegjet e veçanta që i janë dhënë atij dhe jo profetëve të mëparshëm. Ai mishëron një parim qendror të fesë - detyrimi mbetet, por vështirësia hiqet.',
      "Është një masë e përkohshme: pasi uji bëhet i disponueshëm dhe i përdorshëm, rifillon pastrimi i zakonshëm me ujë. Një person mund të ketë nevojë të rinovojë tejemmum për çdo namaz sipas disa shkollave.",
    ],
    quran: [
      {
        excerpt:
          "…dhe nuk gjeni ujë, pastaj bëni tejemmum me tokë të pastër dhe fshini me të fytyrat dhe duart tuaja.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Toka është bërë për mua një vend lutjeje dhe një mjet pastrimi. (Xhabiri - ndër pesë gjërat që i janë dhënë në mënyrë unike Profetit ﷺ)",
      },
    ],
  },
  {
    title: "Kur lejohet tejemumi",
    summary: "Lejohet kur uji mungon, i dëmshëm ose nevojitet urgjentisht për mbijetesë.",
    body: [
      "Tejemmumi lejohet në tri situata të gjera. Së pari, kur nuk mund të gjendet ujë pas një kërkimi të arsyeshëm - udhëtari në shkretëtirë, ose dikush me të vërtetë pa akses. Së dyti, kur përdorimi i ujit do të shkaktonte dëm: për të sëmurët, plagët ose sëmundja e të cilëve do të përkeqësoheshin, ose në të ftohtë të rëndë, pa mjete për të ngrohur ujin dhe një rrezik real dëmtimi.",
      "Së treti, kur uji i pakët në dispozicion është i nevojshëm për një domosdoshmëri më të ngutshme - siç është pirja, për të ruajtur jetën, qoftë të vetes, të tjetrit apo të një kafshe. Në secilin rast, sheriati e peshon ruajtjen e jetës dhe shëndetit mbi metodën e preferuar të pastrimit.",
      "Juristët ndryshojnë në lidhje me pragjet më të holla - sa larg duhet kërkuar për ujë, sa mjafton frika nga dëmi - por ata janë unanim për mëshirën themelore: adhurimi nuk hiqet kurrë, vetëm bëhet më i lehtë.",
    ],
    hadith: [
      {
        excerpt:
          "Tregohet në kapitujt e tejemmumit: koncesioni për të pastruar me tokë të pastër në mungesë të ujit të përdorshëm.",
      },
    ],
    actions: [
      "Kërkoni në mënyrë të arsyeshme për ujë përpara se t'i drejtoheni tejemmumit.",
      "Nëse mjeku këshillon që një plagë ose sëmundje të mbahet e thatë, veproni në të dhe bëni tejemmum.",
    ],
  },
  {
    title: "Tejammum hap pas hapi",
    summary: "Sekuenca e shkurtër dhe e thjeshtë për një pastrim të vlefshëm të thatë.",
    body: [
      "Tejemmumi është qëllimisht i shkurtër - një pasqyrim i qëllimit të tij si një lëshim në vështirësi. Ajo kryhet me një sipërfaqe të pastër, natyrore dheu: tokë, rërë, gurë ose pluhur. Thelbi i tij, që nga demonstrimi i vetë Profetit a.s te Ammar ibn Jasiri, është një goditje e vetme e pëllëmbëve në tokë të pastër, pastaj fshirja e fytyrës dhe e duarve.",
      "Kjo është më e lehtë se abdesi sipas dizajnit, kështu që mos i shtoni komplikime.",
    ],
    steps: [
      {
        title: "Formoni qëllimin",
        body: "Synoni të hiqni papastërtinë rituale për të adhuruar.",
      },
      {
        title: "Thuaj Bismilah",
        body: "Filloni në emër të Allahut.",
      },
      {
        title: "Goditni tokën e pastër një herë me të dyja pëllëmbët",
        body: "Vendosini pëllëmbët lehtë në një sipërfaqe të pastër, me pluhur dhe natyrale.",
      },
      {
        title: "Fshijeni fytyrën",
        body: "Fshijeni të gjithë fytyrën një herë me të dyja duart.",
      },
      {
        title: "Fshij duart",
        body: "Fshij pjesën e pasme të duarve - deri në kyçet e duarve nga shumica e studiuesve.",
        tip: "Ndiqni vazhdimisht metodën e një shkolle (kyçet e duarve kundrejt parakrahëve).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Profeti ﷺ goditi tokën me pëllëmbët e tij, pastaj fshiu fytyrën dhe duart e tij duke i mësuar Ammarit se kjo mjaftonte. ('Amar ibn Jasir)",
      },
    ],
  },
  {
    title: "Çfarë e thyen Tejemmumin?",
    summary:
      "Anulohet nga ndërprerësit e zakonshëm të abdesit - dhe nga kthimi i ujit të përdorshëm.",
    body: [
      "Tejemmumi i kryer në vend të abdesit anulohet nga çdo gjë që e prish abdesin: lehtësimi i vetes, era që kalon, gjumi i thellë etj. Një tejemmum në vend të guslit anulohet gjithashtu nga çdo gjë që shkakton papastërti të madhe.",
      "Në mënyrë unike, tejemmumi përfundon gjithashtu me kthimin e shkakut të tij duke u hequr - domethënë, duke fituar qasje në ujë të përdorshëm. Pasi të gjendet uji dhe të mund të përdoret, koncesioni skadon dhe njeriu kthehet në abdes ose gusl.",
      "Një pikë praktike e mëshirës: nëse jeni falur në mënyrë të vlefshme me tejemum dhe keni gjetur ujë vetëm më pas, shumica mendojnë se namazi i kryer nuk ka nevojë të përsëritet - ai është kryer saktë sipas rregullit që zbatohej në atë kohë. Por nëse uji shfaqet para namazit, duhet ta përdorni atë.",
    ],
    actions: [
      "Rikontrolloni për ujë të disponueshëm në fillim të çdo kohe lutjeje.",
      "Sapo të mund të përdoret uji, kthehuni në pastrim me ujë pa vonesë.",
    ],
    disclaimer:
      "Disa detaje - të tilla si nëse një lutje përsëritet pasi uji të gjendet brenda kohës së tij - ndryshojnë sipas shkollës.",
  },
  {
    title: "Papastërtitë (Nexhasah)",
    summary: "Ndytësira fizike që duhet hequr nga trupi, veshja dhe vendi i faljes.",
    body: [
      "Nexhasah (نجاسة) është ndyrësi rituale e prekshme, e dallueshme nga gjendjet rituale të hadithit. Shembujt e qartë për të cilët është rënë dakord përfshijnë urinën dhe jashtëqitjet e njeriut, gjakun që rrjedh, mishin dhe rrjedhjen e derrit dhe pështymën e një qeni (që kërkon një larje specifike). Heqja e nexhases nga trupi, veshja e veshur dhe pika e namazit është kusht për namazin e vlefshëm.",
      "Largimi bëhet me ujë ku papastërtia është e prekshme, duke u larë derisa të zhduket lënda dhe gjurmët e saj. Islami gjithashtu i trajton seriozisht burimet e nexhasahut: Profeti a.s. paralajmëroi se shumica e dënimit të varrit vjen nga pakujdesia me urinën - spërkatja prej saj dhe mospastrimi i duhur.",
      "Shkollat ​​ndryshojnë për sa i përket klasifikimit të disa substancave (për shembull, nëse sasitë e vogla të lëngjeve të caktuara janë të justifikuara) dhe mbi sasinë e gjurmëve që tolerohen. Parimi i zbatueshëm për jetën e përditshme: pastroni plotësisht dhe mos krijoni dyshime për pastërtinë aty ku nuk ka dëshmi të ndyrësisë.",
    ],
    hadith: [
      {
        excerpt:
          "Profeti ﷺ kaloi dy varre dhe tha se banorët e tyre po ndëshkoheshin - njëri për përhapjen e shpifjeve dhe tjetri sepse ai nuk u mbrojt nga urina e tij. (Ibn Abasi; gjithashtu Sahih Mysliman 292)",
      },
    ],
  },
  {
    title: "Pastrimi i rrobave nga papastërtitë",
    summary: "Si të lahet një rrobë në mënyrë që falja e namazit në të të jetë e vlefshme.",
    body: [
      "Kur naxhasah hyn në rroba, lani zonën e prekur me ujë derisa të hiqet vetë substanca dhe gjurmët e saj të dukshme. Pejgamberi ﷺ e udhëzoi një grua, rrobën e së cilës i ishte njollosur me gjak menstrual, ta kruante, pastaj ta fërkonte me ujë, pastaj ta lante dhe të falej në të.",
      "Nëse, pas një përpjekjeje të sinqertë dhe të plotë, mbetet një njollë e zbehtë me ngjyrë ose erë e lehtë që nuk del, shumica e studiuesve justifikojnë atë që është vërtet e vështirë për t'u hequr - detyrimi është heqja e substancës, jo garantimi i një ngjyre pa njolla.",
      "Disa raste kanë detajet e tyre të njohura, si p.sh. urina e një djali të mitur të ushqyer me gji (e spërkatur dhe jo e larë plotësisht, sipas një lëshimi të raportuar) - kështu që mësoni rregullat praktike të shkollës suaj për situatat me të cilat përballeni.",
    ],
    hadith: [
      {
        excerpt:
          "Sa i përket gjakut menstrual në një rrobë: kruani atë, pastaj fërkojeni me ujë, pastaj lajeni dhe faluni me të. (Esma bint Ebi Bekr)",
      },
    ],
    actions: [
      "Mbani të paktën një rrobë të pastër të lënë mënjanë për lutje.",
      "Nëse papastërtia prek rrobat tuaja larg shtëpisë, shpëlani çfarë mundeni dhe ndërroni kur është e mundur.",
    ],
  },
  {
    title: "Pastrimi i Trupit",
    summary: "Heqja e papastërtisë nga trupi, dhe etiketa e istinjes dhe higjienës.",
    body: [
      "Fëlliqësia në trup duhet të lahet para namazit, brenda mundësive. Rasti më i shpeshtë është pastrimi i vetes pas përdorimit të tualetit — istinja — që bëhet me ujë, ose me material të përshtatshëm të thatë, derisa zona të jetë e pastër. Profeti ﷺ mësoi pastrimin e kujdesshëm pas lehtësimit dhe ndaloi përdorimin e dorës së djathtë për të.",
      "Përtej heqjes së papastërtisë, Islami inkurajon një bazë të higjienës natyrore (fitrah) që e mban trupin të pastër dhe të gatshëm për adhurim: shkurtimi i thonjve, heqja e qimeve nën sqetull dhe pubike, dhe të ngjashme, në baza të rregullta.",
      "Këto praktika nuk janë thjesht bukuri kulturore – ato janë pjesë e dinjitetit dhe pastërtisë me të cilën një besimtar paraqitet para Allahut në lutje.",
    ],
    hadith: [
      {
        excerpt:
          "Pejgamberi salAllahu alejhi ue selem e pastronte veten me ujë pasi e lehtësonte veten. (Anas)",
      },
    ],
    actions: [
      "Gjithmonë plotësoni istinjen para abdesit pas përdorimit të tualetit.",
      "Mbani shami dhe, ku mundeni, një mjet uji gjatë udhëtimit.",
    ],
  },
  {
    title: "Pastrimi i vendeve të lutjes",
    summary: "Vendi i lutjes duhet të jetë pa ndyrësi të njohur - pa dyshim të pabazë.",
    body: [
      "Vendi i faljes duhet të jetë i lirë nga nexhashet e njohura. Profeti ﷺ e mësoi këtë në mënyrë të gjallë: kur një beduin urinonte në cep të xhamisë, ai i ndaloi sahabët që ta qortonin ashpër, e la të mbaronte dhe më pas urdhëroi që të derdhej një kovë me ujë në vend, duke mësuar pastërtinë dhe butësinë.",
      "Rregulli qeverisës është siguria. Toka është bërë përgjithësisht një vend lutjesh, kështu që një sipërfaqe supozohet e pastër nëse nuk keni prova të vërteta të papastërtisë. Nëse e dini se ka papastërti, hiqeni atë ose zhvendoseni në një vend të pastër; nëse thjesht imagjinoni se mund të jetë atje, injoroni pëshpëritjen dhe vazhdoni.",
      "Ky ekuilibër ruan adhurimin nga dy ekstreme: falja e shkujdesur në tokë dukshëm të ndotur dhe paralizimi nga dyshimi i pabazë për çdo sipërfaqe.",
    ],
    hadith: [
      {
        excerpt:
          "Kur një beduin urinoi në xhami, Profeti a.s urdhëroi që të derdhej një kovë me ujë. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Hidhni një sy mbi tapetin tuaj dhe dyshemenë para namazit.",
      "Pa prova të vërteta të ndyrësisë, hidhni poshtë dyshimet e pabaza dhe lutuni.",
    ],
  },
  {
    title: "Hajdi dhe Pastërtia",
    summary: "Menstruacionet dhe gjakderdhja pas lindjes kanë rregullat e tyre të pastrimit.",
    body: [
      "Gjatë menstruacioneve (hajdit) dhe gjakderdhjes pas lindjes (nifas), gruaja nuk falet, dhe - me mëshirën e fesë - namazet e falura në atë kohë nuk falen më pas. Kjo është e vendosur: kur Aishja u pyet se pse gruaja me menstruacione e plotëson agjërimin, por jo namazin, ajo pohoi se kështu janë urdhëruar.",
      "Agjërimi është i ndryshëm: agjërimet e humbura në Ramazan për shkak të menstruacioneve falen më vonë, ndërsa lutjet thjesht hiqen. Kur gjakderdhja përfundon dhe shfaqet një shenjë e pastërtisë, gruaja merr guslin dhe rifillon namazin dhe agjërimin.",
      "Kohëzgjatja e saktë minimale dhe maksimale e hajdit dhe nifas, dhe si të lexohen shenjat kufitare të pastërtisë, janë çështje ku shkollat ​​ndryshojnë në detaje. Gratë përfitojnë nga mësimi i rregullave praktike të një shkolle të besueshme me një mësues të kualifikuar.",
    ],
    hadith: [
      {
        excerpt:
          "E pyetur se pse një grua me menstruacione e bën agjërimin, por jo namazin, Aishja tha: Ne jemi urdhëruar të falim agjërimin dhe nuk jemi urdhëruar të falim namazin. (Muadha, nga Aishja; gjithashtu Sahih Mysliman 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Pyetjet e bëra më shpesh",
    summary: "Përgjigje të shkurtra për shqetësimet dhe dyshimet më të zakonshme të pastrimit.",
    body: [
      "A e prish dyshimi abdesin tim? Jo. Nëse keni marrë abdes dhe thjesht nuk jeni të sigurt nëse e keni prishur atë, abdesi juaj qëndron derisa të jeni të sigurt për një anulues. Të veprosh me siguri mbi dyshimin është një parim profetik që të mbron nga dyshimi obsesiv (isha).",
      "Po gipset, fashat dhe plagët? Ka lëshime. Aty ku larja e një gjymtyre të mbuluar është e dëmshme, ju mund ta fshini veshjen (mash'ala al-xhabirah) në vendin e saj, dhe tejemmumi mbulon atë që nuk mund të arrihet - detajet ndryshojnë sipas shkollës dhe situatës.",
      "Po sikur të mos mund të përdor ujë fare? Tejemmumi me tokë të pastër mbetet plotësisht i vlefshëm derisa të kthehet aftësia për të përdorur ujin.",
      "Po në lidhje me kushtet kronike - gjakderdhje të vazhdueshme (istihadah) apo mosmbajtjeje? Personi trajtohet si një me një arsyetim të vazhdueshëm (ma'dhur): ata pastrohen dhe marrin abdes për çdo kohë të namazit, pastaj falen edhe nëse rrjedhja vazhdon dhe nuk e prish atë namaz.",
    ],
    actions: [
      "Mos lejoni që dyshimi i vazhdueshëm të bllokojë adhurimin tuaj - ndiqni sigurinë, jo dyshimin.",
      "Për kushte kronike ose raste komplekse, merrni një vendim të personalizuar nga një studiues i kualifikuar.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Këto përgjigje të FAQ janë përmbledhje edukative, jo një fetva personale. Rastet komplekse ose kronike duhet të shqyrtohen me një studiues lokal.",
  },
  {
    title: "Referenca dhe studime të mëtejshme",
    summary: "Ajetet thelbësore Kur'anore dhe kapitujt e hadithit mbi pastrimin.",
    body: [
      "Teksti themelor kuranor për pastrim është ajeti i abdesit, Surja el-Maide 5:6, i cili parashtron abdes, gusl dhe tejemmum së bashku; krahas tij, 2:222 ('Allahu i do ata që pastrohen') dhe vargjet mbi pastërtinë e ujit (25:48) ankorojnë temën.",
      "Në Sunet, burimet kryesore janë librat e pastrimit (Kitab al-Taharah / el-Wudu / el-Ghusl / el-Hajd) që hapin Sahih el-Buhari dhe Sahih Mysliman, të ndjekur nga të njëjtat kapituj në katër Sunenet (Ebu Davud, et-Tirmidhi, en-Nesa'idhing, të cilët i mbledhin gradualët.",
      "Për vendimet e aplikuara, manualet klasike të fikhut të katër shkollave sunite japin pozicionet e detajuara - dhe dallimet e tyre janë një pjesë legjitime e traditës, jo një defekt. Përdoreni këtë modul për një pasqyrë të strukturuar, më pas thelloni studimin tuaj me një mësues të kualifikuar dhe tekstet kryesore.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt:
          "Kapitujt gjithëpërfshirës mbi abdes, gusl, tejemmum dhe hajd që hapin koleksionin.",
      },
      {
        excerpt:
          "Libri i pastrimit - raporte autentike mbi vendimet, rregullat e mirësjelljes dhe parimet e taharahut.",
      },
    ],
    actions: [
      "Ndiqni një kurrikulë të besuar për të shmangur konfuzionin nga vendimet e shpërndara.",
      "Rishikojini këto tema periodikisht derisa besimi praktik të jetë i qëndrueshëm.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_SQ: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Abdes para sabahut",
    hint: "Filloni ditën në një gjendje pastërtie kur është e mundur.",
  },
  {
    title: "Siwak / lani dhëmbët",
    hint: "Një sunet para abdesit dhe para namazit.",
  },
  {
    title: "Rrobat e namazit pa nexhase",
    hint: "Kontrolloni për papastërti të dukshme para namazit.",
  },
  {
    title: "Vendi i pastër i lutjes",
    hint: "Largoni çdo gjë të papastër nga vendi ku luteni.",
  },
  {
    title: "Rinovoni abdesin pas anuluesve",
    hint: "Era, gjumi, tualeti - dijeni se çfarë e prish abdesin.",
  },
  {
    title: "Gusl kur kërkohet",
    hint: "Pas papastërtisë së madhe, menstruacionet mbarojnë, ose gjakderdhja pas lindjes.",
  },
];
