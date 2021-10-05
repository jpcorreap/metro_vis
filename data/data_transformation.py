import pandas as pd

filenames = ["2019.xlsx", "2020.xlsx", "2021.xlsx"]
columns = ['dia', 'linea'] + ['{}:00'.format(x)
                              for x in range(4, 24)] + ['total']


def transform_data():
    for filename in filenames:
        dataframe = pd.read_excel(filename).fillna(0)

        dataframe = dataframe.set_axis(columns, axis='columns', inplace=False)

        dataframe.dia = dataframe.dia.dt.strftime('%d-%m-%Y')

        output_name = "./" + filename.split(".")[0] + ".json"

        with open(output_name, 'w', encoding='utf-8') as file:
            dataframe.to_json(output_name, orient='records', force_ascii=False)


if __name__ == "__main__":
    transform_data()
