package com.increff.employee.dao;

import com.increff.employee.pojo.BrandPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public class BrandDao extends AbstractDao {

	private static String delete_id = "delete from BrandPojo p where id=:id";
	private static String select_id = "select p from BrandPojo p where id=:id";
	private static String select_name_cat = "select p from BrandPojo p where name=:name and category=:category";
	private static String select_name = "select p from BrandPojo p where name=:name";
	private static String select_cat = "select p from BrandPojo p where category=:category";
	private static String select_all = "select p from BrandPojo p";

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public BrandPojo insert(BrandPojo p) {
//		System.out.println(p.getName()+p.getId());
		em.persist(p);
		return p;
	}

	public int delete(int id) {
		Query query = em.createQuery(delete_id);
		query.setParameter("id", id);
		return query.executeUpdate();
	}

	public BrandPojo select(int id) {
		TypedQuery<BrandPojo> query = getQuery(select_id, BrandPojo.class);
		query.setParameter("id", id);
		return getSingle(query);
	}

	public BrandPojo select(String name, String category) {
		TypedQuery<BrandPojo> query = getQuery(select_name_cat, BrandPojo.class);
		query.setParameter("name", name);
		query.setParameter("category", category);
		return query.getSingleResult();
	}

	public List<BrandPojo> selectByName(String name) {
		TypedQuery<BrandPojo> query = getQuery(select_name, BrandPojo.class);
		query.setParameter("name", name);
		return query.getResultList();
	}

	public List<BrandPojo> selectByCategory(String category) {
		TypedQuery<BrandPojo> query = getQuery(select_cat, BrandPojo.class);
		query.setParameter("category", category);
		return query.getResultList();
	}

	public List<BrandPojo> selectAll() {
		TypedQuery<BrandPojo> query = getQuery(select_all, BrandPojo.class);
		return query.getResultList();
	}

	public void update(BrandPojo p) {
	}



}
