import json
import csv
import os

RAW_DATA_DIR = 'scripts/data/beerproto_raw'
OUTPUT_DIR = 'backend/src/main/resources/db/data'

def get_v(obj, key, default=0.0):
    if not obj or key not in obj: return default
    val = obj[key]
    if isinstance(val, dict):
        return val.get('value', default)
    return val

def get_range(obj, key):
    r = obj.get(key, {})
    if not isinstance(r, dict): return 0.0, 0.0
    mn = get_v(r.get('minimum'), 'value', 0.0) if isinstance(r.get('minimum'), dict) else 0.0
    mx = get_v(r.get('maximum'), 'value', 0.0) if isinstance(r.get('maximum'), dict) else 0.0
    return mn, mx

def convert_fermentables():
    input_file = os.path.join(RAW_DATA_DIR, 'fermentable.json')
    if not os.path.exists(input_file): return
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    output_file = os.path.join(OUTPUT_DIR, 'fermentables.csv')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['name', 'type', 'color_ebc', 'yield_percentage', 'protein', 'producer', 'origin', 'notes', 'moisture', 'diastatic_power', 'fan', 'beta_glucan'])
        for i in data.get('fermentables', []):
            y_data = i.get('yield', {})
            y = y_data.get('potential', {}).get('value', 75.0) if isinstance(y_data, dict) else 75.0
            w.writerow([i.get('name'), i.get('type', 'GRAIN'), get_v(i, 'color', 0.0), y, get_v(i, 'protein', 0.0), i.get('producer', ''), i.get('origin', ''), i.get('notes', ''), get_v(i, 'moisture', 0.0), get_v(i, 'diastaticPower', 0.0), get_v(i, 'fan', 0.0), get_v(i, 'betaGlucan', 0.0)])

def convert_hops():
    input_file = os.path.join(RAW_DATA_DIR, 'hops.json')
    if not os.path.exists(input_file): return
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    output_file = os.path.join(OUTPUT_DIR, 'hops.csv')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['name', 'alpha_acid', 'origin', 'beta_acid', 'notes', 'substitutes', 'total_oil', 'myrcene', 'humulene', 'cohumulone', 'caryophyllene', 'farnesene'])
        for i in data.get('hopVarieties', []):
            oil = i.get('oilContent', {})
            w.writerow([i.get('name'), get_v(i, 'alphaAcid', 0.0), i.get('origin', 'Unknown'), get_v(i, 'betaAcid', 0.0), i.get('notes', ''), i.get('substitutes', ''), oil.get('totalOilMlPer100g', 0.0) if isinstance(oil, dict) else 0.0, get_v(oil, 'myrcene', 0.0), get_v(oil, 'humulene', 0.0), get_v(oil, 'cohumulone', 0.0), get_v(oil, 'caryophyllene', 0.0), get_v(oil, 'farnesene', 0.0)])

def convert_yeasts():
    input_file = os.path.join(RAW_DATA_DIR, 'culture.json')
    if not os.path.exists(input_file): return
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    output_file = os.path.join(OUTPUT_DIR, 'yeasts.csv')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['name', 'attenuation_min', 'attenuation_max', 'type', 'alcohol_tolerance', 'producer', 'product_id', 'flocculation', 'temp_min', 'temp_max', 'notes', 'best_for'])
        for i in data.get('cultures', []):
            att_min, att_max = get_range(i, 'attenuationRange')
            temp_min, temp_max = get_range(i, 'temperatureRange')
            w.writerow([i.get('name'), att_min, att_max, i.get('type', 'ALE'), get_v(i, 'alcoholTolerance', 0.0), i.get('producer', ''), i.get('productId', ''), i.get('flocculation', 'MEDIUM'), temp_min, temp_max, i.get('notes', ''), i.get('bestFor', '')])

def convert_styles():
    input_file = os.path.join(RAW_DATA_DIR, 'styles.json')
    if not os.path.exists(input_file): return
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    output_file = os.path.join(OUTPUT_DIR, 'styles.csv')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['name', 'category', 'style_id', 'og_min', 'og_max', 'fg_min', 'fg_max', 'ibu_min', 'ibu_max', 'ebc_min', 'ebc_max', 'abv_min', 'abv_max', 'notes', 'aroma', 'appearance', 'flavor', 'mouthfeel'])
        for i in data.get('styles', []):
            og_min, og_max = get_range(i, 'originalGravity')
            fg_min, fg_max = get_range(i, 'finalGravity')
            ibu_min, ibu_max = get_range(i, 'internationalBitternessUnits')
            ebc_min, ebc_max = get_range(i, 'color')
            abv_min, abv_max = get_range(i, 'alcoholByVolume')
            w.writerow([
                i.get('name'), i.get('category'), i.get('id'), # Using BeerProto ID as style_id (e.g. BJCP code)
                og_min, og_max, fg_min, fg_max, ibu_min, ibu_max, ebc_min, ebc_max, abv_min, abv_max,
                i.get('notes', ''), i.get('aroma', ''), i.get('appearance', ''), i.get('flavor', ''), i.get('mouthfeel', '')
            ])

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    convert_fermentables()
    convert_hops()
    convert_yeasts()
    convert_styles()
    print("All data exported to backend resources including Styles.")
