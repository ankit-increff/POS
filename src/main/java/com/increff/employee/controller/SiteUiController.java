package com.increff.employee.controller;

import com.increff.employee.model.InfoData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Objects;

@Controller
public class SiteUiController extends AbstractUiController {

	@Autowired
	private InfoData info;

	// WEBSITE PAGES
	@RequestMapping(value = "")
	public ModelAndView index() {
		return new ModelAndView("redirect:/ui/home");
//		return mav("index.html");
	}

	@RequestMapping(value = "/site/login")
	public ModelAndView login() {
		if(!Objects.equals(info.getEmail(), "")){
			return new ModelAndView("redirect:/ui/home");
		}
		return mav("login.html");
	}

	@RequestMapping(value = "/site/signup")
	public ModelAndView signup() {
		if(!Objects.equals(info.getEmail(), "")){
			return new ModelAndView("redirect:/ui/home");
		}
		return mav("signup.html");
	}

	@RequestMapping(value = "/site/logout")
	public ModelAndView logout() {
		return mav("logout.html");
	}

	@RequestMapping(value = "/site/pricing")
	public ModelAndView pricing() {
		return mav("pricing.html");
	}

	@RequestMapping(value = "/site/features")
	public ModelAndView features() {
		return mav("features.html");
	}

	@RequestMapping(value = "/site")
	public ModelAndView site() {
		if(!Objects.equals(info.getEmail(), "")){
			return new ModelAndView("redirect:/ui/home");
		}
		return new ModelAndView("redirect:/site/login");
	}

}
