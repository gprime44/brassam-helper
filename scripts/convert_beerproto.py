import json
import csv
import os

RAW_DATA_DIR = 'scripts/data/beerproto_raw'
OUTPUT_DIR = 'scripts/data/output'

def convert_fermentables():
    input_file = os.path.join(RAW_DATA_DIR, 'fermentables.json')
    output_file = os.path.join(OUTPUT_DIR, 'fermentables.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'type', 'color_ebc', 'potential_percentage', 'yield_percentage'])
        for item in data:
            writer.writerow([
                item.get('name'),
                item.get('type', 'GRAIN').upper(),
                item.get('color', 0.0),
                item.get('potential', 80.0), # Assuming standardized potential
                item.get('yield', 75.0)
            ])

def convert_hops():
    input_file = os.path.join(RAW_DATA_DIR, 'hops.json')
    output_file = os.path.join(OUTPUT_DIR, 'hops.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'type', 'alpha_acid'])
        for item in data:
            writer.writerow([
                item.get('name'),
                'PELLET', # Default type
                item.get('alpha_acid', 0.0)
            ])

def convert_yeasts():
    input_file = os.path.join(RAW_DATA_DIR, 'yeasts.json')
    output_file = os.path.join(OUTPUT_DIR, 'yeasts.csv')
    
    if not os.path.exists(input_file): return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'attenuation', 'type', 'format'])
        for item in data:
            writer.writerow([
                item.get('name'),
                item.get('attenuation', 75.0),
                item.get('type', 'ALE').upper(),
                'DRY' # Default format
            ])

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    convert_fermentables()
    convert_hops()
    convert_yeasts()
    print(f"Conversion complete. Files generated in {OUTPUT_DIR}")
