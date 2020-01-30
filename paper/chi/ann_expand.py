import pandas as pd
import numpy as np


def main():

    ann = pd.read_csv('./annotation_classification.csv')
    print(len(ann.iloc[1]))

    result = pd.DataFrame(columns=['image', 'cat'])

    image = []
    cat = []

    for id in range(0, 8):
        img = ann.iloc[id]
        for i in range(1, 11):
            for count in range(img[i]):
                image.append(id+1)
                if i == 1:
                    cat.append(i)
                if i == 2:
                    cat.append(i)
                if i == 3:
                    cat.append(i)
                if i == 4:
                    cat.append(i)
                if i == 5:
                    cat.append(i)
                if i == 6:
                    cat.append(i)
                if i == 7:
                    cat.append(i)
                if i == 8:
                    cat.append(i)
                if i == 9:
                    cat.append(i)
                if i == 10:
                    cat.append(i)



    print(len(image))
    print(len(cat))

    result = pd.DataFrame({
        'image':image,
        'category':cat
    })

    print(result)

    result.to_csv("./annotation_expand.csv")


if __name__ == "__main__":
    main()

