package com.increff.employee.controller;

import com.increff.employee.dto.BrandDto;
import com.increff.employee.model.BrandData;
import com.increff.employee.model.BrandForm;
import com.increff.employee.model.InfoData;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Api
@RestController
public class BrandApiController {

	@Autowired
	private BrandDto dto;
	@Autowired
	private InfoData info;

	@ApiOperation(value = "Adds a brand")
	@RequestMapping(path = "/api/brand", method = RequestMethod.POST)
	public void add(@RequestBody BrandForm form) throws ApiException {
		BrandPojo p = convert(form);
		dto.add(p);
	}

	@ApiOperation(value = "Gets a brand by ID")
	@RequestMapping(path = "/api/brand/{id}", method = RequestMethod.GET)
	public BrandData get(@PathVariable int id) throws ApiException {
		BrandPojo p = dto.get(id);
		return convert(p);
	}

	@ApiOperation(value = "Gets list of all brands by name and category")
	@RequestMapping(path = "/api/brand", params = {"brand", "category"}, method = RequestMethod.GET)
	public List<BrandPojo> getByBrandCategory(@RequestParam(value = "brand") String brand, @RequestParam(value = "category") String category) throws ApiException {
//		System.out.println(brand+category);
		return dto.getByNameCategory(brand, category);
	}

	@ApiOperation(value = "Gets list of all brands")
	@RequestMapping(path = "/api/brand", method = RequestMethod.GET)
	public List<BrandData> getAll() {
		List<BrandPojo> list = dto.getAll();
		List<BrandData> list2 = new ArrayList<BrandData>();
		for (BrandPojo p : list) {
			list2.add(convert(p));
		}
		return list2;
	}

	@ApiOperation(value = "Updates a brand")
	@RequestMapping(path = "/api/brand/{id}", method = RequestMethod.PUT)
	public void update(@PathVariable int id, @RequestBody BrandForm f) throws ApiException {
		BrandPojo p = convert(f);
		dto.update(id, p);
	}
	

	private static BrandData convert(BrandPojo p) {
		BrandData d = new BrandData();
		d.setCategory(p.getCategory());
		d.setName(p.getName());
		d.setId(p.getId());
		return d;
	}

	private static BrandPojo convert(BrandForm f) {
		BrandPojo p = new BrandPojo();
		p.setCategory(f.getCategory());
		p.setName(f.getName());
		return p;
	}

}
