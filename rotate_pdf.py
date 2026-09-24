import sys
from pypdf import PdfReader, PdfWriter

def rotate_pdf(input_path, output_path, degrees):
    reader = PdfReader(input_path)
    writer = PdfWriter()

    for page in reader.pages:
        page.rotate(degrees)
        writer.add_page(page)

    with open(output_path, "wb") as output_pdf:
        writer.write(output_pdf)

if __name__ == "__main__":
    rotate_pdf(sys.argv[1], sys.argv[2], int(sys.argv[3]))
