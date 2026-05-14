import csv
import os

def escape_sql(val):
    if val is None or val == '': return 'NULL'
    try:
        float(val)
        return str(val)
    except ValueError:
        return "'" + str(val).replace("'", "''") + "'"

def generate_inserts(csv_path, table_name, columns):
    sql = []
    if not os.path.exists(csv_path):
        return sql
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            vals = [escape_sql(row.get(c)) for c in columns]
            sql.append(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(vals)});")
    return sql

# Generate Inventory Import
sql_inv = []
sql_inv.extend(generate_inserts('backend/src/main/resources/db/data/fermentables.csv', 'fermentables', ['name', 'type', 'color_ebc', 'yield_percentage', 'protein', 'producer', 'origin', 'notes', 'moisture', 'diastatic_power', 'fan', 'beta_glucan']))
sql_inv.extend(generate_inserts('backend/src/main/resources/db/data/hops.csv', 'hops', ['name', 'alpha_acid', 'origin', 'beta_acid', 'notes', 'substitutes', 'total_oil', 'myrcene', 'humulene', 'cohumulone', 'caryophyllene', 'farnesene']))
sql_inv.extend(generate_inserts('backend/src/main/resources/db/data/yeasts.csv', 'yeasts', ['name', 'attenuation_min', 'attenuation_max', 'type', 'alcohol_tolerance', 'producer', 'product_id', 'flocculation', 'temp_min', 'temp_max', 'notes', 'best_for']))

with open('backend/src/main/resources/db/data/inventory_import.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_inv))

# Generate Styles Import
styles_cols = ['name', 'category', 'style_id', 'og_min', 'og_max', 'fg_min', 'fg_max', 'ibu_min', 'ibu_max', 'ebc_min', 'ebc_max', 'abv_min', 'abv_max', 'notes', 'aroma', 'appearance', 'flavor', 'mouthfeel']
sql_styles = generate_inserts('backend/src/main/resources/db/data/styles.csv', 'styles', styles_cols)

with open('backend/src/main/resources/db/data/styles_import.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_styles))
