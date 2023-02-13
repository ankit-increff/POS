package com.increff.employee.controller;

import com.increff.employee.model.InfoData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AppUiController extends AbstractUiController {

	@RequestMapping(value = "/ui/home")
	public ModelAndView home() {
		return mav("index.html");
	}

	@RequestMapping(value = "/ui/employee")
	public ModelAndView employee() {
		return mav("employee.html");
	}

	@RequestMapping(value = "/ui/admin")
	public ModelAndView admin() {
		return mav("user.html");
	}

	@RequestMapping(value = "/ui/brand")
	public ModelAndView brand() {
		return mav("brand.html");
	}

	@RequestMapping(value = "/ui/product")
	public ModelAndView product() {
		return mav("product.html");
	}

	@RequestMapping(value = "/ui/inventory")
	public ModelAndView inventory() {
		return mav("inventory.html");
	}

	@RequestMapping(value = "/ui/order")
	public ModelAndView order() {
		return mav("order.html");
	}

	@RequestMapping(value = "/ui/reports")
	public ModelAndView reports() {
		return mav("reports.html");
	}

	@RequestMapping(value = "/ui/reports/inventory")
	public ModelAndView inventoryReport() {
		return mav("inventoryReport.html");
	}

	@RequestMapping(value = "/ui/reports/brand-category")
	public ModelAndView brandCategoryReport() {
		return mav("brandCategoryReport.html");
	}

	@RequestMapping(value = "/ui/reports/sales")
	public ModelAndView salesReport() {
		return mav("salesReport.html");
	}

	@RequestMapping(value = "/ui/reports/daily-report")
	public ModelAndView dailyReport() {
		return mav("dailyReport.html");
	}

	@RequestMapping(value = "/ui")
	public ModelAndView ui() {
		return new ModelAndView("redirect:/ui/home");
	}



}
