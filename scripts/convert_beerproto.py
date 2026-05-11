import json
import csv
import os

RAW_DATA_DIR = 'scripts/data/beerproto_raw'
OUTPUT_DIR = 'scripts/data/output'

def convert_fermentables():
    input_file = os.path.join(RAW_DATA_DIR, 'fermentable.json')
    output_file = os.path.join(OUTPUT_DIR, 'fermentables.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'type', 'color_ebc', 'yield_percentage', 'protein'])
        for item in data.get('fermentables', []):
            writer.writerow([
                item.get('name'),
                item.get('type', 'GRAIN'),
                item.get('color', {}).get('value', 0.0) if isinstance(item.get('color'), dict) else item.get('color', 0.0),
                item.get('yield', {}).get('value', 75.0) if isinstance(item.get('yield'), dict) else item.get('yield', 75.0),
                item.get('protein', {}).get('value', 0.0) if isinstance(item.get('protein'), dict) else item.get('protein', 0.0)
            ])

def convert_hops():
    input_file = os.path.join(RAW_DATA_DIR, 'hops.json')
    output_file = os.path.join(OUTPUT_DIR, 'hops.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'alpha_acid', 'origin'])
        for item in data.get('hopVarieties', []):
            writer.writerow([
                item.get('name'),
                item.get('alphaAcid', {}).get('value', 0.0) if isinstance(item.get('alphaAcid'), dict) else item.get('alphaAcid', 0.0),
                item.get('origin', 'Unknown')
            ])

def convert_yeasts():
    input_file = os.path.join(RAW_DATA_DIR, 'culture.json')
    output_file = os.path.join(OUTPUT_DIR, 'yeasts.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'attenuation_min', 'attenuation_max', 'type', 'alcohol_tolerance'])
        for item in data.get('cultures', []):
            attenuation = item.get('attenuationRange', {})
            writer.writerow([
                item.get('name'),
                attenuation.get('minimum', 0.0),
                attenuation.get('maximum', 0.0),
                item.get('type', 'ALE'),
                item.get('alcoholTolerance', {}).get('value', 0.0) if isinstance(item.get('alcoholTolerance'), dict) else item.get('alcoholTolerance', 0.0)
            ])

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    convert_fermentables()
    convert_hops()
    convert_yeasts()
    print(f"Conversion complete. Files generated in {OUTPUT_DIR}")
