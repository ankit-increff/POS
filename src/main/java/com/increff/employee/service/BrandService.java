package com.increff.employee.service;

import com.increff.employee.dao.BrandDao;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class BrandService {

	@Autowired
	private BrandDao dao;

	//ADDING A BRAND
	@Transactional(rollbackOn = ApiException.class)
	public BrandPojo add(BrandPojo p) throws ApiException {
		return dao.insert(p);
	}

	//DELETING A BRAND
	@Transactional
	public void delete(int id) {
		dao.delete(id);
	}

	//GETTING A BRAND
	@Transactional(rollbackOn = ApiException.class)
	public BrandPojo get(int id) throws ApiException {
		return dao.select(id);
	}

	//GETTING A BRAND BY NAME AND CATEGORY
	@Transactional(rollbackOn = ApiException.class)
	public BrandPojo get(String name, String category) throws ApiException {
		return dao.select(name, category);

	}

	@Transactional(rollbackOn = ApiException.class)
	public List<BrandPojo> getByNameCategory(String name, String category) throws ApiException {
		if(Objects.equals(name, "") && Objects.equals(category, "")) {
			return dao.selectAll();
		}
		if(Objects.equals(name, "")) {
			return dao.selectByCategory(category);
		}
		if(Objects.equals(category, "")) {
			return dao.selectByName(name);
		}

		List<BrandPojo> brands = new ArrayList<>();
		brands.add(dao.select(name, category));
		return brands;

	}

	//GET ALL BRANDS
	@Transactional
	public List<BrandPojo> getAll() {
		return dao.selectAll();
	}

}
