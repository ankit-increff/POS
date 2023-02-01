package com.increff.employee.controller;

import com.increff.employee.model.InfoData;
import com.increff.employee.model.SignupForm;
import com.increff.employee.pojo.UserPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.UserService;
import com.increff.employee.util.SecurityUtil;
import com.increff.employee.util.SignupUtil;
import com.increff.employee.util.UserPrincipal;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Objects;

@Controller
public class SignupController {

	@Autowired
	private UserService service;
	@Autowired
	private InfoData info;

	@Value("${admin.email}")
	private String adminEmail;
	
	@ApiOperation(value = "Signs up a user")
	@RequestMapping(path = "/session/signup", method = RequestMethod.POST, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ModelAndView signup(HttpServletRequest req, SignupForm f) throws ApiException {

		if(!Objects.equals(f.getPassword(), f.getConfirmPassword()))
		{
			info.setMessage("Passwords do not match...");
			return new ModelAndView("redirect:/site/signup");
		}

		if(!EmailValidator.getInstance().isValid(f.getEmail()))
		{
			info.setMessage("Please enter a valid email address!!");
			return new ModelAndView("redirect:/site/signup");
		}

		if(f.getPassword().length()<4) {
			info.setMessage("Password is too short");
			return new ModelAndView("redirect:/site/signup");
		}

		if(service.get(f.getEmail())!=null) {
			info.setMessage("User already exists!!");
			return new ModelAndView("redirect:/site/login");
		}

		UserPojo p;
		if(Objects.equals(f.getEmail(), adminEmail)){
			p = SignupUtil.convert(f, "supervisor");
		} else {
			p = SignupUtil.convert(f, "operator");
		}
		service.add(p);


		// Create authentication object
		Authentication authentication = convert(p);
		// Create new session
		HttpSession session = req.getSession(true);
		// Attach Spring SecurityContext to this new session
		SecurityUtil.createContext(session);
		// Attach Authentication object to the Security Context
		SecurityUtil.setAuthentication(authentication);

		return new ModelAndView("redirect:/ui/home");

	}

	private static Authentication convert(UserPojo p) {
		// Create principal
		UserPrincipal principal = new UserPrincipal();
		principal.setEmail(p.getEmail());
		principal.setId(p.getId());

		// Create Authorities
		ArrayList<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
		authorities.add(new SimpleGrantedAuthority(p.getRole()));
		// you can add more roles if required

		// Create Authentication
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(principal, null,
				authorities);
		return token;
	}



}
