import glob
import csv
import codecs
from operator import itemgetter
from collections import OrderedDict
import pandas as pd
import glob
import os

files = glob.glob('*.csv')

print(files)
dict = {}

for file in files:
    f = codecs.open(file, 'r','euc_jp')
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        for i in range(len(row[0])):
            if i > 0:
                if(row[0][:i] in dict):
                    dict[row[0][:i]][row[0]] = row[3]
                else:
                    dict[row[0][:i]] = OrderedDict()
                    dict[row[0][:i]][row[0]] = row[3]
    f.close()

print (dict)

#print(type(files))
