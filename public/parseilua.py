import re

# KOTUS taivutustyyppien monikkonominatiivien muodostaminen
# Perustuu Kotimaisten kielten keskuksen taivutusjärjestelmään (tyypit 1-51)

# Astevaihtelutyypit
ASTEVAIHTELUT = {
    'A': {'kk': 'k'},    # kukka : kukan
    'B': {'pp': 'p'},    # pappi : papin
    'C': {'tt': 't'},    # rättiä : rätin
    'D': {'k': ''},      # jalkaan : jalan
    'E': {'p': 'v'},     # oppia : ovin
    'F': {'t': 'd'},     # katu : kadun
    'G': {'nk': 'ng'},   # sankari : sangarin
    'H': {'mp': 'mm'},   # kampa : kamman
    'I': {'lt': 'll'},   # kylta : kyllin
    'J': {'nt': 'nn'},   # ranta : rannan
    'K': {'rt': 'rr'},   # parta : parran
    'L': {'k': 'j'},     # haku : hajun
    'M': {'k': 'v'}      # sika : sivan
}

def muodosta_monikko(sana, taivutustieto):
    """
    Muodostaa sanan monikkonominatiivin Kotus-taivutustiedon perusteella.
    
    Args:
        sana (str): Sana yksikön nominatiivissa
        taivutustieto (str): Taivutustieto esim. "38", "10*C", "5*D"
    
    Returns:
        str: Sanan monikkonominatiivi
    """
    if not taivutustieto or not sana:
        return None
    
    # Parsitaan taivutustieto
    match = re.match(r'(\d+)(\*([A-M]))?', taivutustieto.strip())
    if not match:
        return None
    
    tyyppi = int(match.group(1))
    astevaihtelu = match.group(3) if match.group(3) else None
    
    # Astevaihtelun käsittely
    def sovella_astevaihtelua(sana, vaihtelu_tyyppi):
        if not vaihtelu_tyyppi or vaihtelu_tyyppi not in ASTEVAIHTELUT:
            return sana
        
        for vahva, heikko in ASTEVAIHTELUT[vaihtelu_tyyppi].items():
            # Etsitään vahva aste sanan lopusta (ennen viimeistä vokaalia)
            pattern = f'({vahva})([aeiouyäö]+)$'
            if re.search(pattern, sana):
                # Monikossa käytetään heikkoa astetta
                return re.sub(pattern, f'{heikko}\\2', sana)
        return sana
    
    # KOTUS taivutustyypit (nominit 1-51)
    # Monikkonominatiivi muodostetaan eri tyypeille
    
    # Tyyppi 1: valo -> valot
    if tyyppi == 1:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ot' if sana.endswith('o') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'öt'
    
    # Tyyppi 2: palvelu -> palvelut
    elif tyyppi == 2:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ut' if sana.endswith('u') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'yt'
    
    # Tyyppi 3: valtio -> valtiot
    elif tyyppi == 3:
        return sana + 't'
    
    # Tyyppi 4: laatikko -> laatikot
    elif tyyppi == 4:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ot' if sana.endswith('o') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'öt'
    
    # Tyyppi 5: risti -> ristit
    elif tyyppi == 5:
        return sovella_astevaihtelua(sana, astevaihtelu) + 't'
    
    # Tyyppi 6: paperi -> paperit
    elif tyyppi == 6:
        return sana + 't'
    
    # Tyyppi 7: kalsium -> kalsiumit
    elif tyyppi == 7:
        return sana + 'it'
    
    # Tyyppi 8: nalle -> nallet
    elif tyyppi == 8:
        return sovella_astevaihtelua(sana, astevaihtelu) + 't'
    
    # Tyyppi 9: kala -> kalat
    elif tyyppi == 9:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'at' if sana.endswith('a') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ät'
    
    # Tyyppi 10: koira -> koirat
    elif tyyppi == 10:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'at' if sana.endswith('a') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ät'
    
    # Tyyppi 11: omena -> omenat
    elif tyyppi == 11:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'at' if sana.endswith('a') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ät'
    
    # Tyyppi 12: kulkija -> kulkijat
    elif tyyppi == 12:
        return sana + 't'
    
    # Tyyppi 13: katiska -> katiskat
    elif tyyppi == 13:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'at' if sana.endswith('a') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ät'
    
    # Tyyppi 14: solakka -> solakat
    elif tyyppi == 14:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'at' if sana.endswith('a') else \
               sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'ät'
    
    # Tyyppi 15: korkea -> korkeat
    elif tyyppi == 15:
        return sana + 't'
    
    # Tyyppi 16: vanhempi -> vanhemmat
    elif tyyppi == 16:
        # Poikkeuksellinen: -mpi -> -mmat
        return sana[:-3] + 'mmat'
    
    # Tyyppi 17: vapaa -> vapaat
    elif tyyppi == 17:
        return sana + 't'
    
    # Tyyppi 18: maa -> maat
    elif tyyppi == 18:
        return sana + 't'
    
    # Tyyppi 19: suo -> suot
    elif tyyppi == 19:
        return sana + 't'
    
    # Tyyppi 20: filee -> fileet
    elif tyyppi == 20:
        return sana + 't'
    
    # Tyyppi 21: rosé -> roséet
    elif tyyppi == 21:
        return sana + 't'
    
    # Tyyppi 22: parfait -> parfait't
    elif tyyppi == 22:
        return sana + 't'
    
    # Tyyppi 23: tiili -> tiilet
    elif tyyppi == 23:
        return sana[:-1] + 'et'
    
    # Tyyppi 24: uni -> unet
    elif tyyppi == 24:
        return sana[:-1] + 'et'
    
    # Tyyppi 25: toimi -> toimet
    elif tyyppi == 25:
        return sana[:-1] + 'et'
    
    # Tyyppi 26: pieni -> pienet
    elif tyyppi == 26:
        return sana[:-1] + 'et'
    
    # Tyyppi 27: käsi -> kädet
    elif tyyppi == 27:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'et'
    
    # Tyyppi 28: kynsi -> kynnet
    elif tyyppi == 28:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'net'
    
    # Tyyppi 29: lapsi -> lapset
    elif tyyppi == 29:
        return sana[:-1] + 'set'
    
    # Tyyppi 30: veitsi -> veitset
    elif tyyppi == 30:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'set'
    
    # Tyyppi 31: kaksi -> kakdet (erityistapaus)
    elif tyyppi == 31:
        return sana[:-1] + 'det'
    
    # Tyyppi 32: sisar -> sisaret
    elif tyyppi == 32:
        return sovella_astevaihtelua(sana, astevaihtelu) + 'et'
    
    # Tyyppi 33: kytkin -> kytkinmet
    elif tyyppi == 33:
        return sana + 'met'
    
    # Tyyppi 34: onneton -> onnettomat
    elif tyyppi == 34:
        return sana[:-2] + 'omat' if 'o' in sana else sana[:-2] + 'ömät'
    
    # Tyyppi 35: lämmin -> lämpimät
    elif tyyppi == 35:
        # -min -> -mpimät, astevaihtelu
        return sovella_astevaihtelua(sana[:-3], astevaihtelu) + 'mpimät' if 'ä' in sana else \
               sovella_astevaihtelua(sana[:-3], astevaihtelu) + 'mpimat'
    
    # Tyyppi 36: sisin -> sisimmät
    elif tyyppi == 36:
        return sana + 'mät' if 'ä' in sana else sana + 'mat'
    
    # Tyyppi 37: vasen -> vasemmat
    elif tyyppi == 37:
        return sana[:-2] + 'mmat'
    
    # Tyyppi 38: nainen -> naiset
    elif tyyppi == 38:
        return sana[:-3] + 'set'
    
    # Tyyppi 39: vastaus -> vastaukset
    elif tyyppi == 39:
        return sovella_astevaihtelua(sana, astevaihtelu) + 'kset'
    
    # Tyyppi 40: kalleus -> kalleudet
    elif tyyppi == 40:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'det'
    
    # Tyyppi 41: vieras -> vieraat
    elif tyyppi == 41:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'at' if sana.endswith('as') else \
               sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'ät'
    
    # Tyyppi 42: mies -> miehet
    elif tyyppi == 42:
        return 'miehet' if sana == 'mies' else sana[:-2] + 'het'
    
    # Tyyppi 43: ohut -> ohuet
    elif tyyppi == 43:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'et'
    
    # Tyyppi 44: kevät -> keväädet
    elif tyyppi == 44:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'äät' if 'ä' in sana else \
               sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'aat'
    
    # Tyyppi 45: kahdeksas -> kahdeksannet
    elif tyyppi == 45:
        return sana[:-2] + 'nnet'
    
    # Tyyppi 46: tuhat -> tuhannet
    elif tyyppi == 46:
        return sovella_astevaihtelua(sana[:-2], astevaihtelu) + 'nnet'
    
    # Tyyppi 47: kuollut -> kuolleet
    elif tyyppi == 47:
        return sana[:-2] + 'eet'
    
    # Tyyppi 48: hame -> hameet
    elif tyyppi == 48:
        return sana + 'et'
    
    # Tyyppi 49: askel -> askeleet
    elif tyyppi == 49:
        return sovella_astevaihtelua(sana, astevaihtelu) + 'eet'
    
    # Tyyppi 99: taipumaton (interjektiot yms.)
    elif tyyppi == 99:
        return sana  # Ei monikkomuotoa
    
    # Muut tyypit tai tuntemattomat
    else:
        return None


def etsi_perusosa(sana, sanakirja):
    """
    Etsii yhdyssanan perusosan (viimeinen osa).
    Toimii sekä yhdysmerkillisille (auto-onnettomuus) että 
    yhdysmerkittömille (hiivaleipä) yhdyssanoille.
    
    Args:
        sana (str): Yhdyssana
        sanakirja (dict): Sanakirja jossa kaikki sanat
    
    Returns:
        str: Perusosa tai None
    """
    # Tarkista ensin yhdysmerkilliset yhdyssanat
    erottimet = ['-', ':']
    
    for erotin in erottimet:
        if erotin in sana:
            osat = sana.split(erotin)
            return osat[-1]  # Palauta viimeinen osa
    
    # Yhdysmerkitön yhdyssana - etsi pisin loppuosa joka löytyy sanakirjasta
    # Aloita 3 kirjaimen minimistä (liian lyhyet osat eivät ole todennäköisiä)
    min_pituus = 3
    paras_perusosa = None
    pisin_pituus = 0
    
    for i in range(len(sana) - min_pituus, 0, -1):
        mahdollinen_perusosa = sana[i:]
        
        # Tarkista löytyykö sanakirjasta
        if mahdollinen_perusosa in sanakirja:
            if len(mahdollinen_perusosa) > pisin_pituus:
                pisin_pituus = len(mahdollinen_perusosa)
                paras_perusosa = mahdollinen_perusosa
    
    return paras_perusosa


def taivuta_yhdyssana(sana, perusosa, perusosa_monikko):
    """
    Taivuttaa yhdyssanan korvaamalla perusosan monikkomuodolla.
    
    Args:
        sana (str): Alkuperäinen yhdyssana
        perusosa (str): Perusosa yksikössä
        perusosa_monikko (str): Perusosan monikkomuoto
    
    Returns:
        str: Yhdyssana monikossa
    """
    erottimet = ['-', ':']
    
    # Yhdysmerkillinen yhdyssana
    for erotin in erottimet:
        if erotin in sana:
            osat = sana.split(erotin)
            # Korvataan viimeinen osa monikkomuodolla
            osat[-1] = perusosa_monikko
            return erotin.join(osat)
    
    # Yhdysmerkitön yhdyssana - korvaa perusosa lopusta
    if sana.endswith(perusosa):
        alkuosa = sana[:-len(perusosa)]
        return alkuosa + perusosa_monikko
    
    return None

def kasittele_sanalista():
    """
    Lukee sanalistann ja muodostaa monikkomuodot.
    
    Args:
        tiedosto (str): Polku sanalista-tiedostoon
    
    Returns:
        list: Lista tuple-pareja (sana, monikko)
    """
    
    with open("public\\nykysuomensanalista2024.txt", 'r', encoding='utf-8') as f:
        with open("siisti.txt", "w") as r:

            # Ohita otsikkorivi
            next(f)
            
            for rivi in f:
                osat = rivi.strip().split('\t')

                if len(osat) >= 4:
                    
                    hakusana = osat[0]
                    sanaluokka = osat[2]
                    taivutustieto = osat[3]
                    
                    # Käsitellään vain substantiivit ja adjektiivit
                    if sanaluokka in ['substantiivi', 'adjektiivi'] and hakusana.isalpha():
                        monikko = muodosta_monikko(hakusana, taivutustieto)
                       
                        if monikko:

                            r.write(monikko + "\n")
        

kasittele_sanalista()

print(muodosta_monikko("aakkonen", "38"))
