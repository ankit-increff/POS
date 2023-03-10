package com.increff.employee.util;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.codec.binary.Base64;
import org.apache.fop.apps.FOPException;
import org.apache.fop.apps.FOUserAgent;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.MimeConstants;

public class GeneratePDF {

    public static byte[] createPDF() throws FOPException, TransformerException, IOException {
        File xmlfile = new File("billDataXML.xml");
        File xsltfile = new File("template.xsl");

        File pdffile = new File("resultPDF.pdf");
        FopFactory fopFactory = FopFactory.newInstance();
        FOUserAgent foUserAgent = fopFactory.newFOUserAgent();
        OutputStream out = new java.io.FileOutputStream(pdffile);
        out = new java.io.ByteArrayOutputStream();

        Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, out);
        // Setup XSLT
        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer(new StreamSource(xsltfile));
        // Set the value of a <param> in the stylesheet
        transformer.setParameter("versionParam", "2.0");
        // Setup input for XSLT transformation
        Source src = new StreamSource(xmlfile);
        // Resulting SAX events (the generated FO) must be piped through
        // to FOP
        Result res = new SAXResult(fop.getDefaultHandler());
        // Start XSLT transformation and FOP processing
        transformer.transform(src, res);
        out.close();
        out.flush();
        byte[] byteArray = ((java.io.ByteArrayOutputStream) out).toByteArray();

        // serialize PDF to Base64
        byte[] encodedBytes = java.util.Base64.getEncoder().encode(byteArray);

        return encodedBytes;

    }

    public static void createResponse(HttpServletResponse response, String base64Str) throws IOException {
        String pdfFileName = "output.pdf";
        response.reset();
        response.addHeader("Pragma", "public");
        response.addHeader("Cache-Control", "max-age=0");
        response.setHeader("Content-disposition", "attachment;filename=" + pdfFileName);
        response.setContentType("application/pdf");

        // avoid "byte shaving" by specifying precise length of transferred data
        byte[] decodedBytes = Base64.decodeBase64(base64Str);
        response.setContentLength(decodedBytes.length);
        ServletOutputStream servletOutputStream = response.getOutputStream();
        servletOutputStream.write(decodedBytes);
        servletOutputStream.flush();
        servletOutputStream.close();
    }
}