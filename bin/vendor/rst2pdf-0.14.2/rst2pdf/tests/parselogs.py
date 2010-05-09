#!/usr/bin/env python
# -*- coding: utf-8 -*-

#$HeadURL: https://rst2pdf.googlecode.com/svn/branches/0.14/rst2pdf/tests/parselogs.py $
#$LastChangedDate: 2010-03-08 00:25:16 -0300 (Mon, 08 Mar 2010) $
#$LastChangedRevision: 1730 $

# See LICENSE.txt for licensing terms

'''
Parses log files in output directory generated by autotest.py

For each category of result (good, bad, unknown, fail), prints
a header showing number of tests in that category.  Then prints
sorted list of tests, with checksums.

'''
import os
import glob

def getchecksuminfo():
    for fn in sorted(glob.glob(os.path.join('output', '*.log'))):
        f = open(fn, 'rb')
        data = f.read()
        f.close()
        fn = os.path.splitext(os.path.basename(fn))[0]
        data = data.rsplit('\n', 2)[1]
        if data.startswith('File'):
            yield fn, 'fail', None
        else:
            yield fn, data.rsplit(' ', 1)[-1][:-1], data.split("'")[1]

def getcategories():
    mydict = {}
    for fn, category, checksum in getchecksuminfo():
        myset = mydict.get(category)
        if myset is None:
            mydict[category] = myset = set()
        myset.add((fn, checksum))
    return mydict

def dumpinfo():
    mydict = getcategories()
    if not mydict:
        print '\nNo log files found'
    for name, values in sorted(mydict.iteritems()):
        print '\nCategory "%s"\n        (%d tests)\n' % (name, len(values))
        fmt = '%%-%ds  %%s' % max(len(x[0]) for x in values)
        for item in sorted(values):
            print fmt % (item[0], repr(item[1]))
    print

if __name__ == '__main__':
    dumpinfo()
