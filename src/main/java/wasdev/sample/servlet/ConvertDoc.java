package wasdev.sample.servlet;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ibm.watson.developer_cloud.document_conversion.v1.DocumentConversion;
import com.ibm.watson.developer_cloud.document_conversion.v1.model.Answers;

/**
 * Servlet implementation class DocumentConversion
 */
@WebServlet("/ConvertDoc")
@MultipartConfig
public class ConvertDoc extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	String htmlToAnswers;
    	String uploadFilePath;
    	String applicationPath="";
    	File doc;
    	System.setProperty("http.proxyHost", "10.3.100.207");
    	System.setProperty("http.proxyPort", "8080");
    	System.setProperty("https.proxyHost", "10.3.100.207");
    	System.setProperty("https.proxyPort", "8080");
    	
    	String username = "625c34d4-b9c8-4ce0-aed2-c493e225cc87";
    	String password = "LftxnZL2CqNy";
    	
    	DocumentConversion service = new DocumentConversion("2015-12-15");
    	service.setUsernameAndPassword(username, password);
    	
    	String target = request.getParameter("target");
    	String sample = request.getParameter("sample");
    	
    	ServletContext servletContext = request.getSession().getServletContext();
    	
    	if(sample.equals("true")){
    		applicationPath = servletContext.getRealPath("");
    		System.out.println(applicationPath);
        	uploadFilePath = applicationPath + File.separator + request.getParameter("loc");
        	doc = new File(uploadFilePath);
        	//doc = new File("/home/vcap/app/wlp/usr/servers/defaultServer/apps/myapp.war"+ File.separator + request.getParameter("loc"));
    	}
    	else{
    		Part part =  request.getPart("upload");
            String fileName = getFileName(part);
            part.write(request.getServletContext().getRealPath("") + File.separator + "files" + fileName);
            //part.write("/home/vcap/app/wlp/usr/servers/defaultServer/apps/myapp.war"+ File.separator + "files" + fileName);
            doc = new File(request.getServletContext().getRealPath("") + File.separator + "files" + fileName);
            //doc = new File("/home/vcap/app/wlp/usr/servers/defaultServer/apps/myapp.war"+ File.separator + "files" + fileName);
    	}
    	
    	
    	if(target.equals("html")){
    		htmlToAnswers = service.convertDocumentToHTML(doc).execute();
    		System.out.println(htmlToAnswers);
        	response.setContentType("text/plain");
            response.getWriter().println(htmlToAnswers);
    	}
    	else if(target.equals("text")){
    		htmlToAnswers = service.convertDocumentToText(doc).execute();
    		System.out.println(htmlToAnswers);
        	response.setContentType("text/plain");
            response.getWriter().println(htmlToAnswers);
    	}
    	else{
    		Answers ans = service.convertDocumentToAnswer(doc).execute();
    		System.out.println(ans);
        	response.setContentType("text/plain");
            response.getWriter().println(ans);
    	}
    	
    }
    
    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        System.out.println("content-disposition header= "+contentDisp);
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length()-1);
            }
        }
        return "";
    }

}