'''
辞書の形をSQLのinsert文に整形する
'''

import csv
import codecs
from operator import itemgetter
from collections import OrderedDict
import pandas as pd
import glob
import os

os.remove('./sql.csv')

dbname = 'WordPreDictionaryion'
files = glob.glob('*.csv')
Dictionary = {}

#f = codecs.open('Suffix.csv', 'r','euc_jp')

for file in files:
    f = codecs.open(file, 'r','euc_jp')
    #Dictionary = {}
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        for i in range(len(row[0])):
            if i > 0:
                if(row[0][:i] in Dictionary):
                    Dictionary[row[0][:i]][row[0]] = int(row[3])
                else:
                    Dictionary[row[0][:i]] = {}
                    Dictionary[row[0][:i]][row[0]] = int(row[3])
    f.close()

f = codecs.open('sql.csv','w','utf-8')
#sqlstr = 'INSERT INTO ' + dbname + ' (W_key, word1, word2, word3,word4, word5, word6,word7, word8, word9,word10) VALUES '
#sqlstr = '"' + dbname + '"'
sqlstr = ""
for key,dict in Dictionary.items():
    #print(dict)
    sorted_dict = OrderedDict(sorted(dict.items(), key=lambda x:x[1]))
    sorted_words = list(sorted_dict.keys()) #list
    sqlstr += '"' + key + '"'
    for i in range(10):
        if(i<len(sorted_words)):
            sqlstr += ',"' + sorted_words[i] +'"'
        else:
            sqlstr += ',""'
    sqlstr += '\n'
#print(sqlstr)
f.write(sqlstr)
