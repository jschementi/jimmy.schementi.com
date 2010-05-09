import sys, os
__thisfile__ = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, os.path.join(__thisfile__, "vendor/rst2pdf-0.14.2"))
import rst2pdf.createpdf
rst2pdf.createpdf.main(sys.argv[1:])
