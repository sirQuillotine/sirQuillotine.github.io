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
    def sovella_astevaihtelua(vartalo, vaihtelu_tyyppi):
        """Soveltaa astevaihtelua vartaloon."""
        if not vaihtelu_tyyppi or vaihtelu_tyyppi not in ASTEVAIHTELUT:
            return vartalo
        
        for vahva, heikko in ASTEVAIHTELUT[vaihtelu_tyyppi].items():
            # Etsitään vahva aste vartalosta
            # Monikossa käytetään heikkoa astetta
            if vahva in vartalo:
                # Korvaa viimeinen esiintymä (oikealta vasemmalle)
                pos = vartalo.rfind(vahva)
                if pos != -1:
                    return vartalo[:pos] + heikko + vartalo[pos+len(vahva):]
        return vartalo
    
    # KOTUS taivutustyypit (nominit 1-51)
    # Monikkonominatiivi muodostetaan eri tyypeille
    
    # Tyyppi 1: valo -> valot
    if tyyppi == 1:
        vartalo = sana[:-1]
        if astevaihtelu:
            vartalo = sovella_astevaihtelua(vartalo, astevaihtelu)
        return vartalo + 'ot' if sana.endswith('o') else vartalo + 'öt'
    
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
    
    # Tyyppi 10: koira -> koirat, leipä -> leivät (astevaihtelu p:v)
    elif tyyppi == 10:
        vartalo = sana[:-1]
        if astevaihtelu:
            vartalo = sovella_astevaihtelua(vartalo, astevaihtelu)
        return vartalo + 'at' if sana.endswith('a') else vartalo + 'ät'
    
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
    
    # Tyyppi 27: käsi -> kädet (si -> det, astevaihtelu)
    elif tyyppi == 27:
        if sana.endswith('si'):
            vartalo = sana[:-2]
            if astevaihtelu:
                vartalo = sovella_astevaihtelua(vartalo, astevaihtelu)
            return vartalo + 'det'
        return None
    
    # Tyyppi 28: kynsi -> kynnet
    elif tyyppi == 28:
        if sana.endswith('si'):
            vartalo = sana[:-2]
            if astevaihtelu:
                vartalo = sovella_astevaihtelua(vartalo, astevaihtelu)
            return vartalo + 'net'
        return None
    
    # Tyyppi 29: lapsi -> lapset (si -> set)
    elif tyyppi == 29:
        if sana.endswith('si'):
            vartalo = sana[:-2]
            if astevaihtelu:
                vartalo = sovella_astevaihtelua(vartalo, astevaihtelu)
            return vartalo + 'set'
        return None
    
    # Tyyppi 30: veitsi -> veitset
    elif tyyppi == 30:
        return sovella_astevaihtelua(sana[:-1], astevaihtelu) + 'set'
    
    # Tyyppi 31: kaksi -> kakdet (erityistapaus)
    elif tyyppi == 31:
        return sana[:-1] + 'det'
    
    # Tyyppi 32: sisar -> sisaret
    elif tyyppi == 32:
        return sovella_astevaihtelua(sana, astevaihtelu) + 'et'
    
    # Tyyppi 33: kytkin -> kytkimet (ei -met vaan vartalo muuttuu)
    elif tyyppi == 33:
        # Esim: tulostin -> tulostimet, kytkin -> kytkimet
        # Poista -in, lisää -imet
        if sana.endswith('in'):
            vartalo = sovella_astevaihtelua(sana[:-2], astevaihtelu)
            return vartalo + 'imet'
        return None
    
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
    
    # Tyyppi 39: vastaus -> vastaukset (ei -kset vaan vartalo + kset)
    elif tyyppi == 39:
        # Esim: vastaus -> vastaukset, onnettomuus -> onnettomuudet
        # Poista -s, sovella astevaihtelu, lisää -kset
        if sana.endswith('us'):
            vartalo = sovella_astevaihtelua(sana[:-2], astevaihtelu)
            return vartalo + 'ukset'
        elif sana.endswith('ys'):
            vartalo = sovella_astevaihtelua(sana[:-2], astevaihtelu)
            return vartalo + 'ykset'
        return None
    
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


def kasittele_sanalista_suoraan():
    """
    Lukee sanalistann ja kirjoittaa monikkomuodot suoraan tiedostoon.
    Käsittelee ensin kaikki sanat muistiin, sitten muodostaa monikot.
    """
    import os
    
    tiedostonimi = "public\\nykysuomensanalista2024.txt"
    
    # Tarkista että tiedosto on olemassa
    if not os.path.exists(tiedostonimi):
        print(f"VIRHE: Tiedostoa '{tiedostonimi}' ei löydy!")
        print(f"Nykyinen hakemisto: {os.getcwd()}")
        return
    
    print(f"Luetaan tiedostoa {tiedostonimi}...")
    
    # Ensimmäinen läpikäynti: kerää kaikki sanat sanakirjaan
    sanakirja = {}  # {sana: (sanaluokka, taivutustieto)}
    rivien_maara = 0
    
    with open(tiedostonimi, 'r', encoding='utf-8') as f:
        # Ohita otsikkorivi
        otsikko = next(f, None)
        if otsikko:
            print(f"Otsikko: {otsikko.strip()}")
        
        for rivi in f:
            rivien_maara += 1
            osat = rivi.strip().split('\t')
            if len(osat) >= 3:
                hakusana = osat[0]
                sanaluokka = osat[2] if len(osat) > 2 else ''
                taivutustieto = osat[3] if len(osat) > 3 else ''
                sanakirja[hakusana] = (sanaluokka, taivutustieto)
            
            if rivien_maara % 10000 == 0:
                print(f"  Luettu {rivien_maara} riviä...")
    
    print(f"Yhteensä luettu {rivien_maara} riviä, {len(sanakirja)} sanaa sanakirjassa")
    print()
    
    # Toinen läpikäynti: muodosta monikot ja kirjoita tiedostoon
    print("Muodostetaan monikkomuotoja ja kirjoitetaan tiedostoon siisti.txt...")
    
    kasitelty = 0
    kirjoitettu = 0
    
    with open("siisti.txt", "w", encoding='utf-8') as r:
        for hakusana, (sanaluokka, taivutustieto) in sanakirja.items():
            kasitelty += 1
            
            if kasitelty % 10000 == 0:
                print(f"  Käsitelty {kasitelty}/{len(sanakirja)} sanaa, kirjoitettu {kirjoitettu} monikkomuotoa...")
            
            # Käsitellään vain substantiivit ja adjektiivit
            if sanaluokka not in ['substantiivi', 'adjektiivi']:
                continue
            
            monikko = None
            
            # Jos taivutustieto löytyy suoraan, käytä sitä
            if taivutustieto:
                monikko = muodosta_monikko(hakusana, taivutustieto)
            else:
                # Yhdyssana - etsi perusosan taivutustieto
                perusosa = etsi_perusosa(hakusana, sanakirja)
                
                if perusosa and perusosa in sanakirja:
                    perusosa_sanaluokka, perusosa_taivutus = sanakirja[perusosa]
                    
                    # Varmista että perusosa on substantiivi tai adjektiivi
                    if perusosa_sanaluokka in ['substantiivi', 'adjektiivi'] and perusosa_taivutus:
                        # Taivuta perusosa
                        perusosa_monikko = muodosta_monikko(perusosa, perusosa_taivutus)
                        
                        if perusosa_monikko:
                            # Muodosta yhdyssanan monikko
                            monikko = taivuta_yhdyssana(hakusana, perusosa, perusosa_monikko)
            
            # Kirjoita monikko tiedostoon jos se muodostui
            if monikko:
                juu = (taivutustieto) if taivutustieto else perusosa_taivutus
                r.write(monikko + " " + juu + "\n")
                kirjoitettu += 1
    
    print(f"\n✓ Valmis! Kirjoitettu {kirjoitettu} monikkomuotoa tiedostoon 'siisti.txt'")
    return kirjoitettu

kasittele_sanalista_suoraan()
# Esimerkkikäyttö
if __name__ == "__main__":
    # Testejä yksittäisille sanoille
    testit = [
        ('kissa', '9*F'),        # kissa -> kissat
        ('koira', '10*F'),       # koira -> koirat
        ('talo', '1'),           # talo -> talot
        ('auto', '1'),           # auto -> autot
        ('aakkonen', '38'),      # aakkonen -> aakkoset
        ('paperi', '6'),         # paperi -> paperit
        ('nainen', '38'),        # nainen -> naiset
        ('ihminen', '38'),       # ihminen -> ihmiset
        ('lapsi', '29*F'),       # lapsi -> lapset
        ('käsi', '27*F'),        # käsi -> kädet
        ('kirja', '9'),          # kirja -> kirjat
        ('kukka', '9*A'),        # kukka -> kukat
    ]
    
    print("Testiesimerkkejä yksittäisistä sanoista:\n")
    print(f"{'Sana':<20} {'Taivutus':<10} {'Monikko':<20}")
    print("-" * 50)
    
    for sana, taivutus in testit:
        monikko = muodosta_monikko(sana, taivutus)
        print(f"{sana:<20} {taivutus:<10} {monikko or 'ei tunnistettu':<20}")
    
    print("\n\nYhdyssanoja:")
    print("-" * 50)
    # Simuloidaan sanakirjaa yhdyssanojen testaamiseen
    testi_sanakirja = {
        'tulostin': ('substantiivi', '33'),
        'kerho': ('substantiivi', '1'),
        'kuppi': ('substantiivi', '5'),
        'leipä': ('substantiivi', '10*E'),  # Korjattu: E = p:v astevaihtelu
        'onnettomuus': ('substantiivi', '39'),
    }
    
    yhdyssana_testit = [
        '3D-tulostin',      # tulostin -> tulostimet
        '4H-kerho',         # kerho -> kerhot  
        'kahvikuppi',       # kuppi -> kupit
        'hiivaleipä',       # leipä -> leivät (p -> v)
        'auto-onnettomuus', # onnettomuus -> onnettomuudet
    ]
    
    print("Odotetut tulokset:")
    print("3D-tulostin -> 3D-tulostimet")
    print("4H-kerho -> 4H-kerhot")
    print("kahvikuppi -> kahvikupit")
    print("hiivaleipä -> hiivaleivät")
    print("auto-onnettomuus -> auto-onnettomuudet")
    print()
    
    for yhdyssana in yhdyssana_testit:
        perusosa = etsi_perusosa(yhdyssana, testi_sanakirja)
        if perusosa and perusosa in testi_sanakirja:
            _, taivutus = testi_sanakirja[perusosa]
            perusosa_monikko = muodosta_monikko(perusosa, taivutus)
            if perusosa_monikko:
                yhdyssana_monikko = taivuta_yhdyssana(yhdyssana, perusosa, perusosa_monikko)
                print(f"{yhdyssana:<20} (perusosa: {perusosa}) -> {yhdyssana_monikko}")
        else:
            print(f"{yhdyssana:<20} -> perusosaa ei löytynyt")
    
    
    print("\n\nSanalistasta lukeminen:")
    print("Käyttö: tulokset = kasittele_sanalista('sanalista.txt')")
    print("Tiedoston tulee olla muotoa:")
    print("Hakusana\\tHomonymia\\tSanaluokka\\tTaivutustiedot")
    print("\nYhdyssanoilla ei tarvitse olla taivutustietoa - ohjelma etsii sen perusosasta!")