package com.yunfei.core;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * MyUtils.java Create on 2008-9-17 ����10:45:20
 * 
 * ������
 * 
 * Copyright (c) 2008 by MTA.
 * 
 * @author �����
 * @version 1.0
 */
public class MyUtils {

	public static void main(String[] s) {
		List conditions = new ArrayList();
		MyUtils.addToCollection(conditions, MyUtils.split("a,b-c d,e f-g", " ,-"));
		System.out.println(conditions);// output[a, b, c, d, e, f, g]
	}

	/**
	 * ɾ���ļ�
	 * 
	 * @param filePathAndName
	 *          String �ļ�·������� ��c:/fqf.txt
	 * @param fileContent
	 *          String
	 * @return boolean
	 */
	public static boolean delFile(String filePathAndName) {
		File myDelFile = new java.io.File(filePathAndName);
		if (!myDelFile.exists()) {
			return true;
		}
		return myDelFile.delete();
	}

	/**
	 * �ϴ��ļ�
	 * 
	 * @param uploadFileName
	 *          ���ϴ����ļ����
	 * @param savePath
	 *          �ļ��ı���·��
	 * @param uploadFile
	 *          ���ϴ����ļ�
	 * @return newFileName
	 */
	public static String upload(String uploadFileName, String savePath, File uploadFile) {
		String newFileName = getRandomName(uploadFileName, savePath);
		try {
			FileOutputStream fos = new FileOutputStream(savePath + newFileName);
			FileInputStream fis = new FileInputStream(uploadFile);
			byte[] buffer = new byte[1024];
			int len = 0;
			while ((len = fis.read(buffer)) > 0) {
				fos.write(buffer, 0, len);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return newFileName;
	}

	/**
	 * ���·������һϵ�е�Ŀ¼
	 * 
	 * @param path
	 */
	public static void mkDirectory(String path) {
		File file;
		try {
			file = new File(path);
			if (!file.exists()) {
				file.mkdirs();
			}
		} catch (RuntimeException e) {
			e.printStackTrace();
		} finally {
			file = null;
		}
	}

	/**
	 * �����������ÿһ��Ԫ�طֱ���ӵ�ָ��������,����Apache commons collections �еķ���
	 * 
	 * @param collection
	 *          Ŀ�꼯�϶���
	 * @param arr
	 *          ��������
	 */
	public static void addToCollection(Collection collection, Object[] arr) {
		if (null != collection && null != arr) {
			CollectionUtils.addAll(collection, arr);
		}
	}

	/**
	 * ���ַ��Ѷ���ָ�����Ϊ����,����Apache commons lang �еķ���
	 * 
	 * <pre>
	 *    Example:
	 *     String[] arr = StringUtils.split(&quot;a b,c d,e-f&quot;, &quot; ,-&quot;);
	 *     System.out.println(arr.length);//���6
	 * </pre>
	 * 
	 * @param str
	 *          Ŀ���ַ�
	 * @param separatorChars
	 *          �ָ����ַ�
	 * @return �ַ�����
	 */
	public static String[] split(String str, String separatorChars) {
		return StringUtils.split(str, separatorChars);
	}

	/**
	 * ����ָ���ֶε�setter����
	 * 
	 * <pre>
	 *    Example:
	 *    User user = new User();
	 *    MyUtils.invokeSetMethod(&quot;userName&quot;, user, new Object[] {&quot;����&quot;});
	 * </pre>
	 * 
	 * @param fieldName
	 *          �ֶ�(����)���
	 * @param invokeObj
	 *          �����÷����Ķ���
	 * @param args
	 *          �����÷����Ĳ�������
	 * @return �ɹ����
	 */
	public static boolean invokeSetMethod(String fieldName, Object invokeObj, Object[] args) {
		boolean flag = false;
		Field[] fields = invokeObj.getClass().getDeclaredFields(); // ��ö���ʵ���������ж�����ֶ�
		Method[] methods = invokeObj.getClass().getDeclaredMethods(); // ��ö���ʵ���������ж���ķ���
		for (Field f : fields) {
			String fname = f.getName();
			if (fname.equals(fieldName)) {// �ҵ�Ҫ���µ��ֶ���
				String mname = "set" + (fname.substring(0, 1).toUpperCase() + fname.substring(1));// �齨setter����
				for (Method m : methods) {
					String name = m.getName();
					if (mname.equals(name)) {
						// ����Integer����
						if (f.getType().getSimpleName().equalsIgnoreCase("integer") && args.length > 0) {
							args[0] = Integer.valueOf(args[0].toString());
						}
						// ����Boolean����
						if (f.getType().getSimpleName().equalsIgnoreCase("boolean") && args.length > 0) {
							args[0] = Boolean.valueOf(args[0].toString());
						}
						try {
							m.invoke(invokeObj, args);
							flag = true;
						} catch (IllegalArgumentException e) {
							flag = false;
							e.printStackTrace();
						} catch (IllegalAccessException e) {
							flag = false;
							e.printStackTrace();
						} catch (InvocationTargetException e) {
							flag = false;
							e.printStackTrace();
						}
					}
				}
			}
		}
		return flag;
	}

	/**
	 * �ж��ļ��Ƿ����
	 * 
	 * @param fileName
	 * @param dir
	 * @return
	 */
	public static boolean isFileExist(String fileName, String dir) {
		File files = new File(dir + fileName);
		return (files.exists()) ? true : false;
	}

	/**
	 * �������ļ���,��֤��ͬһ���ļ����²�ͬ��
	 * 
	 * @param fileName
	 * @param dir
	 * @return
	 */
	public static String getRandomName(String fileName, String dir) {
		String[] split = fileName.split("\\.");// ���ļ�����.����ʽ���
		String extendFile = "." + split[split.length - 1].toLowerCase(); // ���ļ�����Ч��׺

		Random random = new Random();
		int add = random.nextInt(1000000); // ���������10000����
		String ret = add + extendFile;
		while (isFileExist(ret, dir)) {
			add = random.nextInt(1000000);
			ret = fileName + add + extendFile;
		}
		return ret;
	}

	/**
	 * ��������ͼ
	 * 
	 * @param file
	 *          �ϴ����ļ���
	 * @param height
	 *          ��С�ĳߴ�
	 * @throws IOException
	 */
	public static void createMiniPic(File file, float width, float height) throws IOException {
		Image src = javax.imageio.ImageIO.read(file); // ����Image����
		int old_w = src.getWidth(null); // �õ�Դͼ��
		int old_h = src.getHeight(null);
		int new_w = 0;
		int new_h = 0; // �õ�Դͼ��
		float tempdouble;
		if (old_w >= old_h) {
			tempdouble = old_w / width;
		} else {
			tempdouble = old_h / height;
		}

		if (old_w >= width || old_h >= height) { // ����ļ�С������ͼ�ĳߴ����Ƽ���
			new_w = Math.round(old_w / tempdouble);
			new_h = Math.round(old_h / tempdouble);// ������ͼ����
			while (new_w > width && new_h > height) {
				if (new_w > width) {
					tempdouble = new_w / width;
					new_w = Math.round(new_w / tempdouble);
					new_h = Math.round(new_h / tempdouble);
				}
				if (new_h > height) {
					tempdouble = new_h / height;
					new_w = Math.round(new_w / tempdouble);
					new_h = Math.round(new_h / tempdouble);
				}
			}
			BufferedImage tag = new BufferedImage(new_w, new_h, BufferedImage.TYPE_INT_RGB);
			tag.getGraphics().drawImage(src, 0, 0, new_w, new_h, null); // ������С���ͼ
			FileOutputStream newimage = new FileOutputStream(file); // ������ļ���
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(newimage);
			JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(tag);
			param.setQuality((float) (100 / 100.0), true);// ����ͼƬ����,100���,Ĭ��70
			encoder.encode(tag, param);
			encoder.encode(tag); // ��JPEG����
			newimage.close();
		}
	}

	/**
	 * �ж��ļ������Ƿ��ǺϷ���,�����ж�allowTypes���Ƿ��contentType
	 * 
	 * @param contentType
	 *          �ļ�����
	 * @param allowTypes
	 *          �ļ������б�
	 * @return �Ƿ�Ϸ�
	 */
	public static boolean isValid(String contentType, String[] allowTypes) {
		if (null == contentType || "".equals(contentType)) {
			return false;
		}
		for (String type : allowTypes) {
			if (contentType.equals(type)) {
				return true;
			}
		}
		return false;
	}
}
